import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-tabset-visual',
  templateUrl: './tabset-visual.component.html'
})
export class TabsetVisualComponent {

  public onActiveIndexChange(value: number): void {
    console.log('Active index change:', value);
  }

  public onTabClose(value: any): void {
    console.log('Close clicked for:', value);
  }

}
