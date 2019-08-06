import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output
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
  public disabled: boolean = false;

  @Input()
  public heading: string;

  public get routerLink(): string {
    return this.heading.toLowerCase().replace(/[\W]/g, '');
  }

  @Output()
  public close = new EventEmitter<void>();

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
