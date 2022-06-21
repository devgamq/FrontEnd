import { Component, OnInit, ViewChild } from "@angular/core";
// import {} from "@types/googlemaps";
import { SignalR, SignalRConnection, IConnectionOptions } from "ng2-signalr";
import * as urls from "../../../domain/Shared/global";
declare var google;

@Component({
  selector: "app-ciclismo",
  templateUrl: "./ciclismo.component.html",
  styleUrls: ["./ciclismo.component.css"]
})
export class CiclismoComponent implements OnInit {
  @ViewChild("gmap")
  gmapElement: any;
  map: google.maps.Map;

  directionsService: any = null;
  directionsDisplay: any = null;
  data: any;
  coordenadas;
  private _connection: SignalRConnection;
  o: IConnectionOptions = {
    hubName: "CiclismoHub",
    qs: { name: "versus", group: "contacto" },
    url: urls.urlSockets
  };
  markers = [];
  constructor(private _signalR: SignalR) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.data = [];
  }

  ngOnInit() {
    this.conectar();
    let mapProp = {
      center: new google.maps.LatLng(-17.408438177754324, -66.13831232888117),
      //center: new google.maps.LatLng(-17.37856193677729, -66.16687920507525),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.directionsDisplay.setMap(this.map);
    const flightPlanCoordinates = [
      { lat: -17.385004459797795, lng: -66.15776506689855 },
      { lat: -17.382670015063322, lng: -66.15946558741399 },
      { lat: -17.38229270071785, lng: -66.15954040412703 },
      { lat: -17.382067445238988, lng: -66.15964501027861 },
      { lat: -17.38197017574196, lng: -66.15978180293837 },
      { lat: -17.381924100698996, lng: -66.15988640908995 },
      { lat: -17.381230413928293, lng: -66.16015597109595 },
      { lat: -17.381028194780686, lng: -66.16014524225989 },
      { lat: -17.38086949098939, lng: -66.16006879930296 },
      { lat: -17.38067495067042, lng: -66.1601479244689 },
      { lat: -17.38059047915174, lng: -66.16027532939711 },
      { lat: -17.379919825105056, lng: -66.1605247748355 },
      { lat: -17.377764500425727, lng: -66.16113363628187 },
      { lat: -17.377585315521323, lng: -66.1610303712348 },
      { lat: -17.3774586060902, lng: -66.16100220804014 },
      { lat: -17.376716266247136, lng: -66.1609767270545 },
      { lat: -17.375856172182406, lng: -66.16094990496435 },
      { lat: -17.375287893530203, lng: -66.16088284973898 },
      { lat: -17.374356117509063, lng: -66.16089089636603 },
      { lat: -17.37365728238175, lng: -66.1608493221263 },
      { lat: -17.37309923629906, lng: -66.16078897242346 },
      { lat: -17.37272549806354, lng: -66.16072057609358 },
      { lat: -17.372940525634686, lng: -66.15724979762831 },
      { lat: -17.373073637814112, lng: -66.15719883565703 },
      { lat: -17.373199070356176, lng: -66.15702851538458 },
      { lat: -17.373193950662266, lng: -66.15684210185805 },
      { lat: -17.37309923629906, lng: -66.15671201472082 },
      { lat: -17.372986602938514, lng: -66.15664361839094 },
      { lat: -17.373143372148483, lng: -66.15386158591161 },
      { lat: -17.373185609630642, lng: -66.15380961811195 },
      { lat: -17.37320032875093, lng: -66.1537589914168 },
      { lat: -17.37319072932478, lng: -66.15369696533332 },
      { lat: -17.37315553142464, lng: -66.15365505581747 },
      { lat: -17.373764841256165, lng: -66.14398093460221 },
      { lat: -17.37380323883734, lng: -66.14338011978288 },
      { lat: -17.373938910226265, lng: -66.14336804984231 },
      { lat: -17.37408994052213, lng: -66.14325137375016 },
      { lat: -17.37417185520677, lng: -66.14299254058022 },
      { lat: -17.37741001572708, lng: -66.14251443682332 },
      { lat: -17.377865657433393, lng: -66.14415594874043 },
      { lat: -17.379268412420778, lng: -66.14968129931111 },
      { lat: -17.379841798225968, lng: -66.15204700766225 },
      { lat: -17.380978325495942, lng: -66.15703591642995 },
      { lat: -17.38172064805623, lng: -66.1598012739243 },
      { lat: -17.38209948737501, lng: -66.16087952194829 },
      { lat: -17.382334981691464, lng: -66.16132476864476 },
      { lat: -17.38263702830599, lng: -66.16168150244374 },
      { lat: -17.382811088840523, lng: -66.16184511719365 },
      { lat: -17.3849612347317, lng: -66.16258004246373 },
      { lat: -17.3861079688775, lng: -66.16247811852116 },
      { lat: -17.386558469611522, lng: -66.16250494061131 },
      { lat: -17.387131832577964, lng: -66.16304540572781 },
      { lat: -17.387226598721924, lng: -66.16374392010499 },
      { lat: -17.38746464608813, lng: -66.16423610545922 },
      { lat: -17.387618224869716, lng: -66.16440508462716 },
      { lat: -17.388104556827642, lng: -66.16462234355737 },
      { lat: -17.388672795688237, lng: -66.16458747484018 },
      { lat: -17.389031143611813, lng: -66.16434339381982 },
      { lat: -17.38949187562506, lng: -66.16438899137307 },
      { lat: -17.393915901887038, lng: -66.16669091047731 },
      { lat: -17.393982450361335, lng: -66.16689207615343 },
      { lat: -17.393987569473737, lng: -66.16753044189898 },
      { lat: -17.394069475252714, lng: -66.16765650572268 },
      { lat: -17.39415138099501, lng: -66.16760554375139 },
      { lat: -17.394161619210223, lng: -66.16727563204256 },
      { lat: -17.39411042812844, lng: -66.1667794233748 },
      { lat: -17.39404387970072, lng: -66.16643878282991 },
      { lat: -17.39391078277264, lng: -66.16585137905565 },
      { lat: -17.393434704506273, lng: -66.16342397989717 },
      { lat: -17.392989339844924, lng: -66.16068008007494 },
      { lat: -17.39251325918018, lng: -66.15792545141665 },
      { lat: -17.392239384257834, lng: -66.15634831251589 },
      { lat: -17.39190151930267, lng: -66.15458207787958 },
      { lat: -17.39079065588454, lng: -66.15481140675035 },
      { lat: -17.389782170349772, lng: -66.15500586690393 },
      { lat: -17.387647438976146, lng: -66.1554323381373 },
      { lat: -17.3876883932896, lng: -66.1557568854281 },
      { lat: -17.386106526271938, lng: -66.15695583285776 },
      { lat: -17.385004459797795, lng: -66.15776506689855 }
    ];

    // var lineSymbol = {
    //   path: 'M 0,-1 0,1',
    //   strokeOpacity: 1,
    //   scale: 3.4
    // };
    const lineSymbol = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      strokeColor: "#393"
    };
    const flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: false,
      strokeColor: "#294f27",
      strokeOpacity: 0.5,
      icons: [
        {
          icon: lineSymbol,
          offset: "100%"
        }
      ],
      // icons: [{
      //   icon: lineSymbol,
      //   offset: '100px',
      //   repeat: '10px'
      // }]
      strokeWeight: 9
    });

    flightPath.setMap(this.map);
    //this.animateCircle(flightPath);
    //this.calculateRoute();
  }

  public animateCircle(line) {
    let count = 0;
    window.setInterval(function() {
      count = (count + 1) % 200;

      const icons = line.get("icons");
      icons[0].offset = count / 2 + "%";
      //console.log(icons[0].offset);
      line.set("icons", icons);
    }, 200);
  }

  private conectar() {
    this._connection = this._signalR.createConnection(this.o);
    this._connection.start().then(c => {
      const listenerSuceso = c.listenFor("ChangeCyclistList");
      listenerSuceso.subscribe(data => {
        this.data = data;
        console.log(data);
      });
      const listenerMarker = c.listenFor("MoveMarker");
      listenerMarker.subscribe(resp => {
        this.moveMarker(resp);
      });
    });
  }

  private moveMarker(resp) {
    this.coordenadas = resp;

    if (this.markers.length > 0) {
      const i = this.SearchMarker(
        this.markers,
        this.coordenadas.competidor.PersonaId
      );
      if (i != -1) {
        this.markers[i].mkr.setPosition(
          new google.maps.LatLng(this.coordenadas.lat, this.coordenadas.lng)
        );
      } else {
        this.AddMarker();
      }
    } else {
      this.AddMarker();
      // this.map.panTo(
      //   new google.maps.LatLng(this.coordenadas.lat, this.coordenadas.lng)
      // );
    }
    console.clear();
    console.log(this.markers);
  }

  AddMarker() {
    const MarkerImg = {
      url: `assets/07/iconos/${this.coordenadas.competidor.DelegacionId}.jpg`,
      size: new google.maps.Size(32, 20),
      scaledSize: new google.maps.Size(32, 20),
      labelOrigin: new google.maps.Point(0, -10)
    };
    const marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        this.coordenadas.lat,
        this.coordenadas.lng
      ),
      label: {
        color: "blue",
        fontWeight: "bold",
        text: this.coordenadas.competidor.Nombre,
        fontSize: "18"
      },
      icon: MarkerImg
      // icon: "assets/images/Ubicacion/yo3-02.png"
    });
    this.markers.push({
      id: this.coordenadas.competidor.PersonaId,
      mkr: marker
    });
    this.markers[this.markers.length - 1].mkr.setMap(this.map);
  }

  public SearchMarker(arreglo, personaId) {
    let i = -1;
    for (let index = 0; index < this.markers.length; index++) {
      if (arreglo[index].id == personaId) {
        i = index;
        break;
      }
    }
    return i;
  }

  private calculateRoute() {
    const waypoints1 = [
      {
        location: { lat: -17.418336730003716, lng: -66.13225758088385 },
        stopover: false
      },
      {
        location: { lat: -17.417310905343705, lng: -66.13791256521267 },
        stopover: false
      },
      {
        location: { lat: -17.415775361154346, lng: -66.14141553018612 },
        stopover: false
      },
      {
        location: { lat: -17.41162288675815, lng: -66.14252596471829 },
        stopover: false
      },
      {
        location: { lat: -17.406627772389722, lng: -66.14478263475974 },
        stopover: false
      },
      {
        location: { lat: -17.402143685006354, lng: -66.14720198729117 },
        stopover: false
      },
      {
        location: { lat: -17.400648964767747, lng: -66.14202008920262 },
        stopover: false
      },
      {
        location: { lat: -17.400045976422692, lng: -66.1391780433309 },
        stopover: false
      },
      {
        location: { lat: -17.399458426983948, lng: -66.1372022823914 },
        stopover: false
      },

      {
        location: { lat: -17.399328277127633, lng: -66.13613532262394 },
        stopover: false
      },
      {
        location: { lat: -17.400300877478372, lng: -66.13399491983006 },
        stopover: false
      },
      {
        location: { lat: -17.403955760960915, lng: -66.13055632787297 },
        stopover: false
      },
      {
        location: { lat: -17.40904381039455, lng: -66.12705336289952 },
        stopover: false
      },
      {
        location: { lat: -17.415984623209585, lng: -66.12614677625248 },
        stopover: false
      }
    ];
    this.directionsService.route(
      {
        origin: new google.maps.LatLng(-17.4176550962773, -66.12968925493476),
        destination: new google.maps.LatLng(
          -17.41763468289894,
          -66.12962901604925
        ),
        waypoints: waypoints1,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode["WALKING"],
        avoidTolls: false
      },
      (response, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(response);
          this.directionsDisplay.setDirections(response);
        } else {
          alert("Could not display directions due to: " + status);
        }
      }
    );
  }
}
