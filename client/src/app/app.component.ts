import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {Observable, merge, fromEvent, of} from 'rxjs';
import {MatDialog, MatTable} from "@angular/material";
import {DialogComponent} from './dialog/dialog.component';
import {MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import {DataServiceService} from "./data-service.service";
import {MatSnackBar} from "@angular/material";
import {catchError, finalize, startWith, tap, throttleTime, distinctUntilChanged, debounceTime} from "rxjs/operators";
import {FormControl, FormGroup, Validators, FormBuilder} from "@angular/forms";


export interface User {
  id: number;
  first: string;
  last: string;
  email: string;
  phone: string;
  location: string;
  hobby: string;
  added?: Date;
  action?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['first', 'last', 'email', 'phone', 'location', 'hobby', 'update', 'delete'];
  public serverForm: FormGroup;
  public total: number;
  public pages: number;
  public count: number;
  dataSource;
  public loading: boolean;
  users: User[];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<any>;
  @ViewChild('input', {static: false}) input: ElementRef;

  // dataSource: MatTableDataSource<User>;
  constructor(private dataService: DataServiceService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              public snackBar: MatSnackBar
  ) {
    // this.dataSource = new MatTableDataSource(this.dataService.getUsers);
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.dataService
      .getUsers(0, 5, 'first', 1, '').pipe(throttleTime(50000), catchError(() => of([])),
      finalize(() => this.loading = false))
      .subscribe((result: any) => {
        this.total = result.count;
        this.users = result.docs;
        console.log('total', this.total);
        // this.loadRecordsPage();

        this.dataSource = new MatTableDataSource(result.docs);
        this.pages = Math.round(this.total / 5);
        console.log('the pages are', this.pages);
        // this.dataSource = this.users;
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;
        // this.count, parseInt(limit, 10),parseInt(order, 10)
      });
  }

  ngAfterViewInit() {

    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadRecordsPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
    // this.paginator.page
      .pipe(
        startWith(null),
        tap(() => this.loadRecordsPage())
      )
      .subscribe();
  }

  loadRecordsPage() {
    this.loading = true;
    const ord = (this.sort.direction === 'asc') ? '1' : '-1';
    console.log('the page:', this.paginator.pageSize, this.paginator.pageIndex, this.sort.direction);
    this.dataService.getUsers(this.paginator.pageIndex, this.paginator.pageSize, this.sort.active,
      parseInt(ord, 10), this.input.nativeElement.value).pipe(debounceTime(900000), catchError(() => of([])),
      finalize(() => this.loading = false))
      .subscribe((result: any) => {
        console.log('tot record', this.total);
        this.total = result.count;
        this.users = result.docs;
        this.dataSource = new MatTableDataSource(result.docs);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      });
  }

// To Get List Of Employee
//   getUsers() {
//     this.dataService
//       .getUsers()
//       .subscribe((data: User[]) => {
//         this.users = data;
//         console.log('the user are', this.users);
//         this.dataSource = new MatTableDataSource(data);
//         // this.dataSource = this.users;
//         this.dataSource.paginator = this.paginator;
//         this.dataSource.sort = this.sort;
//       });
//   }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '425px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      const added = new Date().toLocaleDateString();
      if (result.event === 'Add') {
        // let id = Math.max.apply(null, this.users.map(s => s.id));
        let id = this.total;

        if (id > 0) {
          id++;
        } else {
          id = 1;
        }
        console.log('added item', {...result.data, id, added});

        this.dataService.addUser({...result.data, id, added}).subscribe((data: User) => {
          console.log('the added user are', data);
          // this.dataSource.push({
          //   id,
          //   first: result.data.first,
          //   last: result.data.last,
          //   email: result.data.email,
          //   phone: result.data.phone,
          //   location: result.data.location,
          //   hobby: result.data.hobby,
          //   added
          //
          // });
          // this.table.renderRows();
          // this.getUsers();
          this.loadRecordsPage();

          this.snackBar.open(`user ${result.data.first} added successfully`, 'ok', {
            duration: 3000
          });
        });

      } else if (result.event === 'Update') {
        console.log('updated item', {...result.data, added});
        this.dataService.updateUser(result.data).subscribe(
          data => {
            this.loadRecordsPage();
            // this.dataSource = this.dataSource.filter((value,key)=> {
            //   if (value.id == result.data.id) {
            //     value.first = result.data.first;
            //     value.last = result.data.last;
            //     value.email = result.data.email;
            //     value.phone = result.data.phone;
            //     value.location = result.data.location;
            //     value.hobby = result.data.hobby;
            //     value.added = result.data.added;
            //   }
            //   return true;
            // });
            console.log('the new item updated is', data);
            this.snackBar.open(`user ${result.data.first} updated successfully`, 'ok', {
              duration: 3000
            });
          });

      } else if (result.event === 'Delete') {
        this.dataService.deleteUser(result.data).subscribe(
          data => {
            this.loadRecordsPage();
            // this.getUsers();

            // this.dataSource = this.dataSource.filter((value, key) => {
            //   return value.id != result.data.id;
            // });
            console.log('the new item deleted is', data);
            this.snackBar.open(`user ${result.data.first} deleted successfully`, 'ok', {
              duration: 3000
            });
          });

      }
    });
  }
}



