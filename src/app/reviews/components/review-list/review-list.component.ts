import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { gsap } from 'gsap';
@Component({
  selector: 'rv-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
})
export class ReviewListComponent implements OnInit, AfterViewInit {
  @ViewChild('list', { static: true }) list: ElementRef<HTMLDivElement>;
  numberOfItemsShown = 6;
  count = 0;

  @Output() calculatedWidth = new EventEmitter<string>();
  @Output() btnDisabled = new EventEmitter<boolean>();
  @Input() data?: any[] = [];

  tl = gsap.timeline();

  constructor(
    private hostElement: ElementRef<HTMLElement>,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.itemsToDisplay(this.numberOfItemsShown);
    this.initializeActiveElement();
  }

  selectItem(item: HTMLElement, index: number) {
    // const activeElIndex = this.elementList.findIndex(
    //   (el) => el && el.classList && el.classList.contains('active')
    // );
    const translateValue = `${
      (this.dataListSizes.listItemWidth + this.dataListSizes.listItemMargin) *
      (this.numberOfItemsShown - index - 1)
    }px`;

    this.elementList.forEach((element, itemInd) => {
      const prop = gsap.getProperty(element, 'translateX');
      if (prop < 0) {
        gsap.to(element, {
          duration: 0.5,
          translateX: `${typeof prop === 'number' && (prop + (this.dataListSizes.listItemWidth + this.dataListSizes.listItemMargin))}px`
        });
      } else {
        gsap.to(element, {
          duration: 0.5,
          translateX: translateValue,
        });
      }
    });

    // setTimeout(() => {
    // // after 500 miliseconds move remaning half in negative
    // for (let i = index + 1; i <= this.elementList.length - 1; i++) {
    //   const prop2 = gsap.getProperty(this.elementList[i], 'translateX');
    //   if (prop2 < 0) {
    //     return;
    //   } else {
    //   gsap.to(this.elementList[i], {
    //     duration: 0,
    //     translateX: `-${(this.dataListSizes.listItemWidth + this.dataListSizes.listItemMargin) * (index + 1)}px`
    //   });
    // }
    //   this.list.nativeElement.children[this.getActiveElement().activeElementIndex].classList.remove('active');
    //   this.list.nativeElement.children[index].classList.add('active');
    //   this.cdr.detectChanges();
    //   }

    // }, 500);



  }

  /*

  */
  goNext() {
    this.btnDisabled.emit(true);
    const translateValue = (this.dataListSizes.listItemWidth + this.dataListSizes.listItemMargin);
    this.elementList.forEach((elem) => {
      const prop = gsap.getProperty(elem, 'translateX');
      if (prop < 0) {
        // continue translating in negative values
        gsap.to(elem, {
          duration: 0.5,
          translateX: `${(prop as number) + translateValue}px`
        });
      } else {
        // translate all the elements first
        gsap.to(elem, {
          duration: 0.5,
          translateX: (prop as number) > 0 ? `${(prop as number) + translateValue}px` : `${translateValue}px`,
          onComplete: () => {
            /* translation complete */
            if (this.getActiveElement().activeElementIndex === 0) {
              // if index is 0, we have reached the end. now we want to reset translation to 0
              console.log(this.getActiveElement().activeElementIndex, this.getActiveElement().activeElement);
              gsap.to(this.getActiveElement().activeElement, {
                // duration: 0,
                translateX: `0px`
              });
            } else {
              console.log(this.getActiveElement().activeElementIndex, this.getActiveElement().activeElement);
              // positioning currently active element to negative position after all moving items complete.
              // and then remove active class
              gsap.to(this.getActiveElement().activeElement, {
                // duration: 0,
                translateX: `-${(this.dataListSizes.listItemWidth + this.dataListSizes.listItemMargin) * (this.getActiveElement().activeElementIndex)}px`,
              });

            }
            this.cdr.detectChanges();
          }
        });
      }


    });

    this.changeActiveElement();
  }


  private changeActiveElement(): void {
    setTimeout(() => {
      // this.list.nativeElement.prepend(this.list.nativeElement.children[this.getActiveElement().activeElementIndex]);
      if (this.getActiveElement().activeElementIndex === 0) {
        // reset active element to what it was initially
        this.list.nativeElement.children[this.getActiveElement().activeElementIndex].classList.remove('active');
        this.list.nativeElement.children[this.numberOfItemsShown - 1].classList.add('active');
      } else {
        this.list.nativeElement.children[this.getActiveElement().activeElementIndex - 1].classList.add('active');
        this.list.nativeElement.children[this.getActiveElement().activeElementIndex].classList.remove('active');

      }
      this.cdr.detectChanges();
    }, 600);
  }

  /**
   *  cast the HTMLCollection into an Array of HTMLElement
   */
  private get elementList(): HTMLElement[] {
    if (this.listExists()) {
      return Array.prototype.slice.call(this.list.nativeElement.children);
    }
  }
  public itemsToDisplay(itemCount: number): void {
    const calculatedWidth = `${
      (this.dataListSizes.listItemWidth + this.dataListSizes.listItemMargin) *
      itemCount
    }px`;
    this.calculatedWidth.emit(calculatedWidth);
    this.hostElement.nativeElement.style.width = calculatedWidth;
  }
  private initializeActiveElement(): void {
    if (!this.getActiveElement().isActive) {
      const element = this.elementList[this.numberOfItemsShown - 1] as HTMLElement;
      element.classList.add('active');
      // this.tl.to(element, {
      //   duration: 0,
      //   position: 'absolute',
      //   bottom: 0,
      //   right: 0,
      // }).to(element, {
      //   duration: 0.5,
      //   height: 700,
      // });
    }
  }
  private getActiveElement(): { isActive: boolean; activeElement: HTMLElement, activeElementIndex: number } {
    let obj: any = {
       isActive: false,
       activeElement: null,
       activeElementIndex: null
    };
    this.elementList.forEach((node, ind) => {
      if (node && node.classList) {
       obj = {
        ...obj,
        isActive: node.classList.contains('active'),
       };
      }
      if (node && node.classList && node.classList.contains('active')) {
        obj = {
          ...obj,
          activeElement: node,
          activeElementIndex: ind
        };
      }
    });
    return obj;
  }
  private listExists(): boolean {
    return (
      this.list &&
      this.list.nativeElement &&
      this.list.nativeElement.childNodes &&
      this.list.nativeElement.childNodes.length > 0
    );
  }
  private get dataListSizes() {
    let sizes = {
      containerWidth: null,
      containerHeight: null,
      listItemWidth: null,
      listItemHeight: null,
      listItemMargin: null,
    };
    if (this.listExists()) {
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
      };
    }

    return sizes;
  }
}
