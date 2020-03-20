import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@service/index';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit {
  constructor(
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.utilsService.clear();
  }
}
