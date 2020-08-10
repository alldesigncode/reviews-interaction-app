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
  numberOfItemsShown = 4;
  count = 0;

  @Output() calculatedWidth = new EventEmitter<string>();
  @Output() btnDisabled = new EventEmitter<boolean>();
  @Input() data?: any[] = [];

  tl = gsap.timeline();

  constructor(
    private hostElement: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.itemsToDisplay(this.numberOfItemsShown);
    this.initializeTranslateQueue();
  }

  selectItem(item: HTMLElement, index: number, actualItem) {
    console.log(item, index);


    // const activeElIndex = this.elementList.findIndex(
    //   (el) => el && el.classList && el.classList.contains('active')
    // );
    // const translateValue = `${
    //   (this.dataListSizes.listItemWidth + this.dataListSizes.listItemMargin) *
    //   (this.numberOfItemsShown - index - 1)
    // }px`;

    // this.elementList.forEach((element, itemInd) => {
    //   const prop = gsap.getProperty(element, 'translateX');
    //   if (prop < 0) {
    //     gsap.to(element, {
    //       duration: 0.5,
    //       translateX: `${typeof prop === 'number' && (prop + (this.dataListSizes.listItemWidth + this.dataListSizes.listItemMargin))}px`
    //     });
    //   } else {
    //     gsap.to(element, {
    //       duration: 0.5,
    //       translateX: translateValue,
    //     });
    //   }
    // });

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
    // gsap.to(this.list.nativeElement.children[this.getActiveElement().activeElementIndex], {
    //   height: this.dataListSizes.listItemHeight,
    //   translateY: 0,
    //   opacity: 0,
    //   background: '#ccc'
    // });
    // gsap.to(this.list.nativeElement.children[this.getActiveElement().activeElementIndex - 1], {
    //   height: 500,
    //   translateY: '-210px',
    //   background: '#1e1e1e',
    // });


    const translateValue = (this.dataListSizes.listItemWidth + this.dataListSizes.listItemMargin);
    this.elementList.forEach((elem) => {
      const prop = typeof gsap.getProperty(elem, 'translateX') === 'number' && gsap.getProperty(elem, 'translateX');
      if (prop < 0) {
        // continue translating elements in negative position
        gsap.to(elem, {
          duration: 0.5,
          translateX: `${prop + translateValue}px`,
          onComplete: () => {
            // translate queued element to the beggining
            gsap.to(this.translateElementQueue().activeElement, {
              duration: 0,
              translateX: `-${translateValue
                 * ((this.data.length - this.numberOfItemsShown) + this.translateElementQueue().activeElementIndex)}px`,
            });
          }
        });
      } else {
        // translate elements in normal position
        gsap.to(elem, {
          duration: 0.5,
          translateX: `${prop + translateValue}px`,
        });
      }
    });

    this.changeTranslateElementQueue();
  }


  private changeTranslateElementQueue(): void {
    setTimeout(() => {
      if (this.translateElementQueue().activeElementIndex === 0) {
        // reset queued element to what it was initially
        this.list.nativeElement.children[this.translateElementQueue().activeElementIndex].classList.remove('translate-queue');
        this.list.nativeElement.children[this.data.length - 1].classList.add('translate-queue');
        this.btnDisabled.emit(false);
      } else {
        // change queue
        this.list.nativeElement.children[this.translateElementQueue().activeElementIndex - 1].classList.add('translate-queue');
        this.list.nativeElement.children[this.translateElementQueue().activeElementIndex].classList.remove('translate-queue');
        this.btnDisabled.emit(false);
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
  private initializeTranslateQueue(): void {
    if (!this.translateElementQueue().isActive) {
      const element = this.elementList[this.data.length - 1] as HTMLElement;
      const translateValue = `-${
        (this.dataListSizes.listItemWidth + this.dataListSizes.listItemMargin) *
        (this.data.length - this.numberOfItemsShown)
      }px`;
      element.classList.add('translate-queue');
      this.elementList.forEach((el) =>
        gsap.to(el, {
          duration: 0,
          translateX: translateValue,
        })
      );
      // gsap.to(this.elementList[this.data.length - 1], {
      //   height: 500,
      //   translateY: '-210px'
      // });

    // gsap.to(this.translateElementQueue().activeElement, {
    //   height: 500,
    //   translateY: '-210px'
    // });
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
  private translateElementQueue(): { isActive: boolean; activeElement: HTMLElement, activeElementIndex: number } {
    let obj: any = {
       isActive: false,
       activeElement: null,
       activeElementIndex: null
    };
    this.elementList.forEach((node, ind) => {
      if (node && node.classList) {
       obj = {
        ...obj,
        isActive: node.classList.contains('translate-queue'),
       };
      }
      if (node && node.classList && node.classList.contains('translate-queue')) {
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
