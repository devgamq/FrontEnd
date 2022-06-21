import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JornadaService } from '../../service/Golf/jornada.service';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.css'],
  providers: [JornadaService]
})
export class PushComponent implements OnInit, OnChanges {

  @Input() data: any;
  @Output() response = new EventEmitter();
  pushForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private http: Http,
    private jornadaService: JornadaService, ) {
    this.clean();
  }

  ngOnInit() {
    this.clean();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.data);
    this.clean();
    this.setForm();
  }

  setForm(){
    this.pushForm.controls['Title'].setValue(this.data['title']);
    this.pushForm.controls['Body'].setValue(this.data['body']);
  }

  clean() {
    this.pushForm = this.formBuilder.group({
      Title: ['', Validators.required],
      Body: ['', Validators.required]
    });
  }

  doSetPush(event: any) {
    if (this.pushForm.valid) {
      this.jornadaService.setPush(this.pushForm).subscribe(res => {
        const resp = res.json();
        if (resp === true) {
          this.response.emit(1);
        } else {
          this.response.emit(0);
        }

      });
    } else {
      this.response.emit(-1);
    }
  }
  cancel() {
    this.response.emit(2);
  }

}
