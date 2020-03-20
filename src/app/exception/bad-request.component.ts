import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@service/index';

@Component({
  selector: 'app-bad-request',
  templateUrl: './bad-request.component.html'
})
export class BadRequestComponent implements OnInit {
  constructor(
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.utilsService.clear();
  }
}
