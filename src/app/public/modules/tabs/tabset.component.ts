import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  QueryList
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Subject
} from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

import {
  SkyTabComponent
} from './tab.component';

export interface SkyTabButton {
  ariaControls: string;
  disabled: boolean;
  heading: string;
  id: string;
  isActive: boolean;
  tabIndex: number;
}

let uniqueId: number = 0;

@Component({
  selector: 'sky-tabset',
  templateUrl: './tabset.component.html',
  styleUrls: ['./tabset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTabsetComponent implements AfterContentInit, OnDestroy {

  @Input()
  public set activeIndex(value: number) {
    this._activeIndex = value;
  }

  public get activeIndex(): number {
    return this._activeIndex || 0;
  }

  @Input()
  public ariaLabel: string;

  public set focusIndex(value: number) {
    const tabButtonElements = this.getFocusableTabElements();
    const numTabs = tabButtonElements.length - 1;

    if (value > numTabs) {
      value = 0;
    }

    if (value < 0) {
      value = numTabs;
    }

    this._focusIndex = value;
  }

  public get focusIndex(): number {
    return this._focusIndex || 0;
  }

  public tabButtonConfigs: SkyTabButton[] = [];

  @ContentChildren(SkyTabComponent, { read: SkyTabComponent })
  private tabComponents: QueryList<SkyTabComponent>;

  private get tabsetId(): string {
    return `skytabset${this.uniqueId}`;
  }

  private ngUnsubscribe = new Subject<void>();
  private uniqueId: number;

  private _activeIndex: number = 0;
  private _focusIndex: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private router: Router
  ) {
    this.uniqueId = uniqueId++;
  }

  public ngAfterContentInit(): void {
    this.tabButtonConfigs = this.parseTabButtons(this.tabComponents);
    this.watchStructuralChanges();
    this.watchQueryParamChanges();
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onKeyDown(event: any): void {
    const key = event.key.toLowerCase();

    switch (key) {
      default:
        return;

      case 'arrowleft':
        this.focusIndex--;
        break;

      case 'arrowright':
        this.focusIndex++;
        break;
    }

    const tabButtonElements = this.getFocusableTabElements();
    tabButtonElements.forEach((button: any, i: number) => {
      if (i === this.focusIndex) {
        button.focus();
      }
    });
  }

  public onDeleteButtonClick(index: number): void {
    const found = this.tabComponents.find((t, i) => {
      return (i === index);
    });

    found.close.emit();
  }

  public onTabClick(index: number): void {
    const found = this.tabComponents.find((tab, i) => {
      return (
        i === index &&
        tab.disabled === false
      );
    });

    if (!found) {
      return;
    }

    const queryParams: any = {};
    queryParams[this.tabsetId] = `${found.uniqueId}`;

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute
    });
  }

  private activateTabByIndex(index: number): void {

    // Set index to zero if the value is out of range.
    const numTabs = this.tabButtonConfigs.length - 1;
    if (index > numTabs || index < 0) {
      index = 0;
    }

    this.tabButtonConfigs.forEach((tab, i) => {
      tab.isActive = (i === index);
      tab.tabIndex = this.parseTabIndex(i);
    });

    this.tabComponents.forEach((tabComponent, i) => {
      tabComponent.isActive = (i === index);
    });
  }

  private activateTabById(id: number): void {
    let index: number;

    this.tabComponents.forEach((tabComponent, i) => {
      if (tabComponent.uniqueId === id) {
        index = i;
      }
    });

    this.activeIndex = index;

    this.activateTabByIndex(index);
  }

  private watchStructuralChanges(): void {
    this.tabComponents.changes
      .takeUntil(this.ngUnsubscribe)
      .subscribe((tabs) => {
        this.tabButtonConfigs = this.parseTabButtons(tabs);
        this.activateTabByIndex(this.activeIndex);
        this.changeDetector.markForCheck();
      });
  }

  private watchQueryParamChanges(): void {
    this.activatedRoute.queryParams
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params) => {
        const activeTabIdParam: string = params[this.tabsetId];

        if (activeTabIdParam === undefined) {
          this.activateTabByIndex(this.activeIndex);
          return;
        }

        const activeTabId: number = parseInt(activeTabIdParam, 10);
        this.activateTabById(activeTabId);
      });
  }

  private parseTabButtons(tabs: QueryList<SkyTabComponent>): SkyTabButton[] {
    const buttons = tabs.map((tab, i) => {
      return {
        ariaControls: tab.panelId,
        disabled: tab.disabled,
        heading: tab.heading,
        id: tab.buttonId,
        isActive: false,
        tabIndex: this.parseTabIndex(i)
      };
    });

    return buttons;
  }

  private parseTabIndex(index: number): number {
    const tabIndex = (index === this.activeIndex) ? 0 : -1;

    return tabIndex;
  }

  private getFocusableTabElements(): QueryList<any> {
    const elements = this.elementRef.nativeElement.querySelectorAll('.sky-tab-button');

    return elements;
  }

}
