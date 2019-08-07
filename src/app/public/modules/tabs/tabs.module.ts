import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyTabsResourcesModule
} from '../shared/tabs-resources.module';

import {
  SkyTabCloseButtonComponent
} from './tab-close-button.component';

import {
  SkyTabComponent
} from './tab.component';

import {
  SkyTabsetComponent
} from './tabset.component';

@NgModule({
  declarations: [
    SkyTabCloseButtonComponent,
    SkyTabComponent,
    SkyTabsetComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyIconModule,
    SkyTabsResourcesModule
  ],
  exports: [
    SkyTabComponent,
    SkyTabsetComponent
  ]
})
export class SkyTabsModule { }
