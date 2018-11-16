import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    $('#contactNavicon').on('click', function(e: any) {
      e.preventDefault();

      $('.contact-left').toggleClass('d-block');
      $('.contact-right').toggleClass('d-none');
    });
  }
}
