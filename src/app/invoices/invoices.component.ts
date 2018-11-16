import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.initDataTable();

    // Select2
    $('.dataTables_length select').select2({ minimumResultsForSearch: Infinity });
  }

  public initDataTable() {
    const table = $('#invoiceTable').DataTable({
      ajax: '../../assets/ajax/invoices.txt',

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
        { data: 'status' },
        { data: 'orderStatus' },
        { data: 'orderDate' },
        { data: 'orderNumber' },
        { data: 'companyName' },
        { data: 'taxNumber' },
        { data: 'money' },
        { data: 'amount' },
        { data: 'taxAmount' },
        { data: 'totalAmount' }
      ],
      order: [[1, 'asc']]
    });

    function formatEinvoiceRow(d: any) {
      return '<p>' + JSON.stringify(d) + '</p>';
    }
    // Add event listener for opening and closing details
    $('#invoiceTable tbody').on('click', 'td.details-control', function() {
      const tr = $(this).closest('tr');
      const row = table.row(tr);

      if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
      } else {
        // Open this row
        row.child(formatEinvoiceRow(row.data())).show();
        tr.addClass('shown');
      }
    });
  }
}
