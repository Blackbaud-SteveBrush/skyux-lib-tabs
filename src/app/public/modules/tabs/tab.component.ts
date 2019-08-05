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

  @Output()
  public close = new EventEmitter<void>();

  public get buttonId(): string {
    return `sky-tab-button-${this.uniqueId}`;
  }

  public get panelId(): string {
    return `sky-tab-panel-${this.uniqueId}`;
  }

  public set isActive(value: boolean) {
    this._isActive = value;
    this.changeDetector.markForCheck();
  }

  public get isActive(): boolean {
    return this._isActive || false;
  }

  public get uniqueId(): number {
    return this._uniqueId;
  }

  private _isActive: boolean = false;
  private _uniqueId: number;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {
    this._uniqueId = uniqueId++;
  }
}
