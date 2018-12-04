import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AlertComponent implements OnInit {
  public title: string;
  public message: string;
  public class: string;
  public highlight: string;
  public list: any[] = [];

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}
}
