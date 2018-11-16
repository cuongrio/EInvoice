import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.scss']
})
export class GoodsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.initDataTable();

    // Select2
    $('.dataTables_length select').select2({ minimumResultsForSearch: Infinity });
  }

  public initDataTable() {
    const table = $('#goodTable').DataTable({
      ajax: '../../assets/ajax/goods.txt',
      language: {
        searchPlaceholder: 'Tìm kiếm...',
        sSearch: '',
        lengthMenu: '_MENU_ dòng/trang',
        paginate: {
          previous: '<<',
          next: '>>',
          first: 'Trang đầu',
          last: 'Trang cuối'
        }
      },
      columns: [
        {
          className: 'details-control',
          orderable: false,
          data: null,
          defaultContent: ''
        },
        { data: 'code' },
        { data: 'productName' },
        { data: 'category' },
        { data: 'createdDate' },
        { data: 'price' },
        { data: 'quantity' },
        { data: 'status' }
      ],
      order: [[1, 'asc']]
    });

    function formatGoodRow(d: any) {
      return '<p>' + JSON.stringify(d) + '</p>';
    }
    // Add event listener for opening and closing details
    $('#goodTable tbody').on('click', 'td.details-control', function() {
      const tr = $(this).closest('tr');
      const row = table.row(tr);

      if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
      } else {
        // Open this row
        row.child(formatGoodRow(row.data())).show();
        tr.addClass('shown');
      }
    });
  }
}
