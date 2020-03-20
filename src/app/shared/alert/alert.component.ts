import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AlertComponent implements OnInit {

  @Input()
  public data: {
    title: string;
    message: string;
    class: string;
    highlight: string;
  };

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    if (!this.data.message) {
      this.data.message = 'Đã có lỗi xảy ra!';
      this.data.class = 'error';
    }
  }

  close() {
    this.activeModal.dismiss();
  }
}
