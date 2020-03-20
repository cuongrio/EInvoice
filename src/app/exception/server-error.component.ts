import { Component, OnInit } from '@angular/core';
import { UtilsService } from '@service/index';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html'
})
export class ServerErrorComponent implements OnInit {
  constructor(
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.utilsService.clear();
  }
}
