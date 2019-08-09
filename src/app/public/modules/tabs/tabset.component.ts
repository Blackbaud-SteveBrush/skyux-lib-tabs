import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
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

import {
  SkyTabButtonConfig
} from './tab-button-config';

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
    this.activateTabByIndex(this.activeIndex);
    this.changeDetector.markForCheck();
  }

  public get activeIndex(): number {
    return this._activeIndex || 0;
  }

  @Input()
  public ariaLabel: string;

  @Input()
  public set queryParam(value: string) {
    if (!value) {
      return;
    }

    const sanitized = value.toLowerCase().replace(/[\W]/g, '');
    this._queryParam = `${sanitized}-active-tab`;
  }

  public get queryParam(): string {
    return this._queryParam || '';
  }

  @Output()
  public activeIndexChange = new EventEmitter<number>();

  @Output()
  public closeTab = new EventEmitter<number>();

  @Output()
  public newTab = new EventEmitter<void>();

  @Output()
  public openTab = new EventEmitter<void>();

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

  public get showNewTabButton(): boolean {
    return (this.newTab.observers.length > 0);
  }

  public get showOpenTabButton(): boolean {
    return (this.openTab.observers.length > 0);
  }

  public tabButtonConfigs: SkyTabButtonConfig[] = [];

  @ContentChildren(SkyTabComponent, { read: SkyTabComponent })
  private tabComponents: QueryList<SkyTabComponent>;

  private ngUnsubscribe = new Subject<void>();

  private _activeIndex: number;

  private _focusIndex: number;

  private _queryParam: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef,
    private router: Router
  ) { }

  public ngAfterContentInit(): void {
    this.tabButtonConfigs = this.parseTabButtonConfigs(this.tabComponents);

    // Let the template render the initial state before watching for changes.
    setTimeout(() => {
      this.activateTabByIndex(this.activeIndex);
      this.watchStructuralChanges();
      this.watchQueryParamChanges();
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.activeIndexChange.complete();
    this.closeTab.complete();
    this.newTab.complete();
    this.openTab.complete();
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

  public onCloseButtonClick(index: number): void {
    this.closeTab.emit(index);
  }

  public onNewTabButtonClick(): void {
    this.newTab.emit();
  }

  public onOpenTabButtonClick(): void {
    this.openTab.emit();
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

    if (!this.queryParam || !found.queryParamValue) {
      this.activateTabByIndex(index);
      return;
    }

    const queryParams: any = {};
    queryParams[this.queryParam] = `${found.queryParamValue}`;

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute
    });
  }

  private activateTabByIndex(index: number): void {
    if (!this.tabButtonConfigs || !this.tabComponents) {
      return;
    }

    const found = this.tabButtonConfigs.find((config, i) => {
      return (i === index && config.disabled === false);
    });

    if (!found) {
      this.tabButtonConfigs.forEach(t => t.isActive = false);
      this.tabComponents.forEach(t => t.isActive = false);
      return;
    }

    this.tabButtonConfigs.forEach((tab, i) => {
      tab.isActive = (i === index);
      tab.tabIndex = this.parseTabIndex(i);
    });

    this.tabComponents.forEach((tabComponent, i) => {
      tabComponent.isActive = (i === index);
    });

    // Store the active index for later.
    if (this._activeIndex !== index) {
      this.activeIndex = index;
      this.activeIndexChange.emit(this.activeIndex);
    }

    this.changeDetector.markForCheck();
  }

  private activateTabByKey(key: string): void {
    let index: number;
    this.tabComponents.forEach((tabComponent, i) => {
      if (tabComponent.queryParamValue === key) {
        index = i;
      }
    });

    this.activateTabByIndex(index);
  }

  private watchStructuralChanges(): void {
    this.tabComponents.changes
      .takeUntil(this.ngUnsubscribe)
      .subscribe((tabs) => {
        this.tabButtonConfigs = this.parseTabButtonConfigs(tabs);
        // Wait for the template to rebuild the tabs before updating the active index.
        setTimeout(() => {
          this.activateTabByIndex(this.activeIndex);
        });
      });
  }

  private watchQueryParamChanges(): void {
    this.activatedRoute.queryParams
      .takeUntil(this.ngUnsubscribe)
      .subscribe((params) => {
        const key = params[this.queryParam];
        if (key) {
          this.activateTabByKey(key);
        }
      });
  }

  private parseTabButtonConfigs(tabs: QueryList<SkyTabComponent>): SkyTabButtonConfig[] {
    return tabs.map((tab, i) => {

      const headingCount = (
        tab.headingCount !== undefined &&
        typeof tab.headingCount === 'string'
      ) ? parseInt(tab.headingCount, 10) : tab.headingCount as number;

      return {
        buttonId: tab.buttonId,
        disabled: tab.disabled,
        heading: tab.heading,
        headingCount,
        isActive: false,
        isCloseable: tab.isCloseable,
        panelId: tab.panelId,
        tabIndex: this.parseTabIndex(i)
      };
    });
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
