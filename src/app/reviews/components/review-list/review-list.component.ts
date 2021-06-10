import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  Output,
  EventEmitter,
  OnChanges,
  // SimpleChange,
  OnDestroy, SimpleChange,
} from '@angular/core';
import {Sizes} from '../../models/Sizes';

import {gsap, Expo} from 'gsap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'rv-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
})
export class ReviewListComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  destroyed$ = new Subject<void>();
  @ViewChild('list', {static: true}) list: ElementRef<HTMLDivElement>;
  disabeld = false;
  stabilizing = false;

  @Output() btnDisabled = new EventEmitter<boolean>();
  @Output() stabilizingElements = new EventEmitter<boolean>();

  @Output() calculatedWidth = new EventEmitter<string>();
  @Output() currentIndexChanged = new EventEmitter<number>();

  @Input() data: any[] = [];

  /* we can manually change how many
    elements should be shown on page */
  numberOfElementsShown = 4;
  currentIndex = 0;

  constructor(
    private hostElement: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.btnDisabled
      .asObservable()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((disabled) => (this.disabeld = disabled));
    this.stabilizingElements
      .asObservable()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((stabilizing) => (this.stabilizing = stabilizing));
  }

  ngOnChanges({data}: { data: SimpleChange }) {
    if (Array.isArray(data.currentValue)) {
      this.currentIndex = data.currentValue.length;
      this.increaseCurrentIndex();
    }
  }

  ngAfterViewInit() {
    this.elementsToDisplay(this.numberOfElementsShown);
    this.initializeElements();
  }

  private moveElementsOpposite(selectedIndex: number): void {
    const translateValue = `-${
      (this.sizes.listItemWidth + this.sizes.listItemMargin) *
      (selectedIndex + 1 + (this.data.length - this.numberOfElementsShown))
    }`;

    for (
      let i = selectedIndex + 1;
      i <= this.activeElement().elementIndex;
      i++
    ) {
      gsap.to(this.elementList[i], {
        delay: 1.1,
        duration: 0,
        translateX: translateValue,
      });
    }
  }

  private switchActiveElement({
                                selectedElementIndex,
                              }: {
    selectedElementIndex: number;
  }): void {
    setTimeout(() => {
      this.elementList[this.activeElement().elementIndex].classList.remove(
        'element-active'
      );
      this.elementList[selectedElementIndex].classList.add('element-active');
      this.btnDisabled.emit(false);
    }, 1100);
  }

  selectItem(index: number) {
    this.increaseCurrentIndex(index);
    this.removeSelectedAnimation();

    /* determining how far is the selected element from active element */
    const translateValue = `${
      (this.sizes.listItemWidth + this.sizes.listItemMargin) *
      (this.activeElement().elementIndex - index)
    }`;

    /* We're clicking the element that's in the end of an array.
       We need to manually call goNext() method to stabilize elements */
    if (this.activeElement().elementIndex < index) {
      this.stabilizingElements.emit(true);
      let translateIndex = -1;
      /* calculating translate index */
      for (let i = index; i < this.data.length; i++) {
        translateIndex++;
      }
      for (let j = 0; j <= this.activeElement().elementIndex; j++) {
        translateIndex++;
      }

      this.goNext(true);
      const int = setInterval(() => this.goNext(true), 1100);
      setTimeout(() => {
        clearInterval(int);
        this.animateSelectedElement(index);
      }, (translateIndex - 1) * 1100);
      setTimeout(() => this.stabilizingElements.emit(false), translateIndex * 1000);
    } else {
      this.animateSelectedElement(index);
      this.btnDisabled.emit(true);
      this.elementList.forEach((element) => {
        const prop = gsap.getProperty(element, 'translateX');
        if (prop < 0) {
          gsap.to(element, {
            duration: 1,
            ease: Expo.easeInOut as any,
            translateX: `${(prop as number) + parseInt(translateValue, 10)}px`,
          });
        } else {
          gsap.to(element, {
            duration: 1,
            ease: Expo.easeInOut as any,
            translateX: `${(prop as number) + parseInt(translateValue, 10)}px`,
          });
        }
      });
      this.moveElementsOpposite(index);
      this.switchActiveElement({selectedElementIndex: index});
    }
  }

  goNext(stabilizing: boolean): void {
    if (!stabilizing) {
      this.btnDisabled.emit(true);
      this.removeSelectedAnimation();
      if (this.activeElement().elementIndex === 0) {
        this.animateSelectedElement(this.data.length - 1);
      } else {
        this.animateSelectedElement(this.activeElement().elementIndex - 1);
      }
    }

    const translateValue = this.sizes.listItemWidth + this.sizes.listItemMargin;
    this.elementList.forEach((elem) => {
      const prop = gsap.getProperty(elem, 'translateX');
      if (prop < 0) {
        // continue translating elements in negative position
        gsap.to(elem, {
          duration: 1,
          translateX: `${(prop as number) + translateValue}px`,
          ease: Expo.easeInOut as any,
          onComplete: () => {
            // translate active element to the beginning
            // we can see element going backwards if we comment duration property
            gsap.to(this.activeElement().element, {
              duration: 0,
              translateX: `-${
                translateValue *
                (this.data.length -
                  this.numberOfElementsShown +
                  this.activeElement().elementIndex)
              }`,
            });
          },
        });
      } else {
        // translate elements in nomral position
        gsap.to(elem, {
          duration: 1,
          ease: Expo.easeInOut as any,
          translateX: `${(prop as number) + translateValue}`,
        });
      }
    });
    this.switchActiveElementNext(stabilizing);
  }

  switchActiveElementNext(stabilizing: boolean): void {
    setTimeout(() => {
      if (this.activeElement().elementIndex === 0) {
        // reset active element to what it was initially
        this.elementList[this.activeElement().elementIndex].classList.remove(
          'element-active'
        );
        this.elementList[this.data.length - 1].classList.add('element-active');
        if (!stabilizing) {
          this.btnDisabled.emit(false);
        }
      } else {
        // change active element
        this.elementList[this.activeElement().elementIndex - 1].classList.add(
          'element-active'
        );
        this.elementList[this.activeElement().elementIndex].classList.remove(
          'element-active'
        );
        if (!stabilizing) {
          this.btnDisabled.emit(false);
        }
      }
      this.cdr.detectChanges();
    }, 1100);
  }

  public increaseCurrentIndex(index?: number): void {
    if (this.currentIndex === 0) {
      this.currentIndex = this.data.length;
    }

    this.currentIndex =
      (index ? index : this.currentIndex - 1) % this.data.length;
    this.currentIndexChanged.emit(this.currentIndex);
  }

  public elementsToDisplay(elementCount: number): void {
    const calculatedWidth = `${
      (this.sizes.listItemWidth + this.sizes.listItemMargin) * elementCount
    }px`;
    this.calculatedWidth.emit(calculatedWidth);
    this.hostElement.nativeElement.style.width = calculatedWidth;
  }

  private initializeElements(): void {
    if (!this.activeElement().element) {
      const element = this.elementList[this.data.length - 1] as HTMLElement;
      const translateValue = `-${
        (this.sizes.listItemWidth + this.sizes.listItemMargin) *
        (this.data.length - this.numberOfElementsShown)
      }px`;
      element.classList.add('element-active');
      this.elementList.forEach((el) =>
        gsap.to(el, {duration: 0, translateX: translateValue})
      );
      this.animateSelectedElement(this.data.length - 1);
    }
  }

  private animateSelectedElement(index: number): void {
    gsap.to(this.elementList[index], {
      height: this.sizes.animationHeight,
      duration: 1,
      ease: Expo.easeInOut as any,
      translateY: `-${
        this.sizes.animationHeight -
        (this.sizes.listItemWidth + this.sizes.listItemMargin)
      }px`,
    });
  }

  private removeSelectedAnimation(): void {
    gsap.to(this.activeElement().element, {
      height: this.sizes.listItemHeight,
      duration: 1,
      ease: Expo.easeInOut as any,
      translateY: 0,
    });
  }

  /**
   * cast the HTMLCollection into an Array of HTMLElement
   */
  private get elementList(): HTMLElement[] {
    if (this.listExists) {
      return Array.prototype.slice.call(this.list.nativeElement.children);
    }
  }

  private get listExists(): boolean {
    return (
      this.list &&
      this.list.nativeElement &&
      this.list.nativeElement.childNodes &&
      this.list.nativeElement.childNodes.length > 0
    );
  }

  private activeElement(): {
    element: HTMLElement;
    elementIndex: number;
  } {
    let obj = {
      element: null,
      elementIndex: null,
    };
    this.elementList.forEach((node, ind) => {
      if (node && node.classList && node.classList.contains('element-active')) {
        obj = {
          ...obj,
          element: node,
          elementIndex: ind,
        };
      }
    });
    return obj;
  }

  private get sizes(): Sizes {
    let sizes = {} as Sizes;
    if (this.listExists) {
      const dataList = this.list.nativeElement;
      sizes = {
        containerWidth: dataList.getBoundingClientRect().width,
        containerHeight: dataList.getBoundingClientRect().height,
        listItemWidth:
          (dataList.childNodes[0] as HTMLDivElement).classList &&
          (dataList.childNodes[0] as HTMLDivElement).getBoundingClientRect()
            .width,
        listItemHeight:
          (dataList.childNodes[0] as HTMLDivElement).classList &&
          (dataList.childNodes[0] as HTMLDivElement).getBoundingClientRect()
            .height,
        listItemMargin: 40,
        animationHeight: 730,
      };
    }

    return sizes;
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
