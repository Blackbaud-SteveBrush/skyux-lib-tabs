import {
  Component
} from '@angular/core';

@Component({
  selector: 'app-tabset-visual',
  templateUrl: './tabset-visual.component.html'
})
export class TabsetVisualComponent {

  public activeIndex = 1;

  public tabConfigs: {
    content: string;
    heading: string;
    disabled?: boolean;
    headingCount?: number;
    isCloseable?: boolean;
    queryParamValue?: string;
  }[] = [
    {
      content: 'Tab 1 content.',
      heading: 'Tab 1',
      headingCount: 45
    },
    {
      content: 'Tab 2 content.',
      heading: 'Of Mice & Men',
      headingCount: 0,
      isCloseable: true
    },
    {
      content: 'Tab 3 content.',
      disabled: true,
      heading: 'Questions?',
      isCloseable: true
    },
    {
      content: 'Duplicate tab content.',
      heading: 'Tab 1',
      isCloseable: true,
      queryParamValue: 'foobar'
    }
  ];

  constructor() {
    setTimeout(() => {

      this.tabConfigs[2] = {
        content: 'Tab 3 content.',
        disabled: false,
        heading: 'Questions?',
        headingCount: undefined,
        isCloseable: true
      };

      this.activeIndex = 2;

    }, 1000);
  }

  public onActiveIndexChange(value: number): void {
    console.log('Active index change:', value);
  }

  public onCloseTab(value: any): void {
    this.tabConfigs.splice(value, 1);
  }

  public onNewTab(): void {
    this.tabConfigs.push({
      content: 'Tab content.',
      disabled: false,
      heading: 'Tab',
      headingCount: undefined,
      isCloseable: true
    });
  }

  public onOpenTab(): void {
    console.log('Open tab clicked.');
  }

}
