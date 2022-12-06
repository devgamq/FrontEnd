import {
  Component, ViewChild, AfterViewInit, Input, Output, OnChanges,
  SimpleChanges, EventEmitter, ViewEncapsulation
} from '@angular/core';
@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WebcamComponent implements AfterViewInit, OnChanges {
  @ViewChild('video') video: any;
  @ViewChild('canvas') canvas: any;
  _video: any;
  _canvas: any;
  _photo: any;
  context: any;
  visible = true;
  imgString: string;
  photoValid: any = false;
  photoStade: any = false;
  _stream: any;
  existCam = true;
  imagebase64: any;

  @Input() PrivilegiosIdsInput?: string[];
  @Input() bandera?: any;
  @Input() clearData = false;
  @Output() PrivilegiosIdsOut = new EventEmitter();
  @Output() restore = new EventEmitter();

  @Input() entrada: any;
  @Output() base64 = new EventEmitter();
  constructor() { }

  ngAfterViewInit() {
    // this._video = this.video.nativeElement;
    this._canvas = this.canvas.nativeElement;
    // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //   navigator.mediaDevices.getUserMedia({ video: true })
    //     .then(stream => {
    //       this._video.src = window.URL.createObjectURL(stream);
    //       this._video.play();
    //       this._stream = stream;
    //     },
    //     error => {
    //       this._video.poster = '/assets/erpHammer/images/webcam.jpg';
    //       this.existCam = false;
    //     });

    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    const chng = changes['bandera'];
    const banderaValue = JSON.stringify(chng.currentValue);
    if (banderaValue === 'true') {
      if (this.bandera && !this.PrivilegiosIdsInput) {
        this.onValid();
      }
    }
  }

  capture() {
    this.visible = false;
    this.context = this._canvas.getContext('2d');
    this.context.drawImage(this._video, 0, 0, 320, 240);
    const data = this._canvas.toDataURL('image/png');
    this.photoStade = true;
  }

  fileEvent(fileInput: any) {
    this.context = this._canvas.getContext('2d');
    const file = fileInput.target.files[0];
    const fileName = file.name;
    console.log(file);// aqui validar tamaño
    const img = new Image;
    img.onload = () => {
      this.context.drawImage(img, 0, 0, 210, 150); // 320,240
      this.photoStade = true;
      this.onValid();
    };
    img.src = URL.createObjectURL(file);
    let archivo=file;
    let reader= new FileReader;
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
      this.imagebase64= reader.result;   
    };

  }

  onValid() {
    this.imgString = this.imagebase64;
    this.photoValid = (!this.photoStade);
    if (!this.photoValid) {
      this.base64.emit(this.imgString);
    } else {
      this.restore.emit(false);
    }
  }
}
