import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';

let uniqueId = 0;

@Component({
  selector: 'sky-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyTabComponent {

  @Input()
  public isClosable: boolean = false;

  @Input()
  public disabled: boolean = false;

  @Input()
  public heading: string;

  @Input()
  public headingCount: string | number;

  public get routerLink(): string {
    return this.heading.toLowerCase().replace(/[\W]/g, '');
  }

  public get buttonId(): string {
    return `sky-tab-button-${this.tabId}`;
  }

  public get panelId(): string {
    return `sky-tab-panel-${this.tabId}`;
  }

  public set isActive(value: boolean) {
    this._isActive = value;
    this.changeDetector.markForCheck();
  }

  public get isActive(): boolean {
    return this._isActive || false;
  }

  private tabId: number;

  private _isActive: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {
    this.tabId = uniqueId++;
  }
}
