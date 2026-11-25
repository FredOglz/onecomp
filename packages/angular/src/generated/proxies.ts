/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@onec/components/components';

import { defineCustomElement as defineOnecButton } from '@onec/components/components/onec-button.js';
import { defineCustomElement as defineOnecIcon } from '@onec/components/components/onec-icon.js';
@ProxyCmp({
  defineCustomElementFn: defineOnecButton,
  inputs: ['color', 'disabled', 'loading', 'name', 'size', 'type', 'value', 'variant']
})
@Component({
  selector: 'onec-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'disabled', 'loading', 'name', 'size', 'type', 'value', 'variant'],
})
export class OnecButton {
  protected el: HTMLOnecButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnecButton extends Components.OnecButton {}


@ProxyCmp({
  defineCustomElementFn: defineOnecIcon,
  inputs: ['label', 'name', 'size']
})
@Component({
  selector: 'onec-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['label', { name: 'name', required: true }, 'size'],
})
export class OnecIcon {
  protected el: HTMLOnecIconElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface OnecIcon extends Components.OnecIcon {}


