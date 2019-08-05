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
  SkyTabsResourcesModule
} from '../shared/tabs-resources.module';

import {
  SkyTabComponent
} from './tab.component';

import {
  SkyTabsetComponent
} from './tabset.component';

@NgModule({
  declarations: [
    SkyTabComponent,
    SkyTabsetComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyTabsResourcesModule
  ],
  exports: [
    SkyTabComponent,
    SkyTabsetComponent
  ]
})
export class SkyTabsModule { }
