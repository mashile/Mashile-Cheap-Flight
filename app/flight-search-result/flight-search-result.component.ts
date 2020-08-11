import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FlightModel } from './../interface/flight-model';
import { FlightService } from './../service/flight.service';

// To create to and fro flight combinations
export interface combo {
  flight1: FlightModel,
  flight2: FlightModel
}

@Component({
  selector: 'app-flight-search-result',
  templateUrl: './flight-search-result.component.html',
  styleUrls: ['./flight-search-result.component.css']
})
export class FlightSearchResultComponent implements OnInit {

  @Input() flightResults: FlightModel;
  @Input() tripType: boolean; //One way or round trip based on tab selected
  @Input() lower: number; //Lower limit of price range
  @Input() upper: number; //Upper limit of price range
  toFlights: FlightModel[] = [];
  froFlights: FlightModel[] = [];
  resultArr: combo[] = [];

  // Using constructor, call the FlightService.
  constructor(private _flightService: FlightService) { }

  ngOnInit() {
    // Split the result array from service to "to flights" and "fro flights"
    this.toFlights = this.flightResults[0];
    this.froFlights = this.flightResults[1];
    for (let i = 0; i < this.flightResults[0].length; i++) {
      if (JSON.stringify(this.flightResults[1]) !== `[]`) {
        for (let j = 0; j < this.flightResults[1].length; j++) {
          if (this.flightResults[0][i].FareDetails + this.flightResults[1][j].FareDetails >= this.lower
            && this.flightResults[0][i].FareDetails + this.flightResults[1][j].FareDetails <= this.upper) {
            this.resultArr.push({ flight1: this.flightResults[0][i], flight2: this.flightResults[1][j] });
          }
        }
      } else {
        this.resultArr.push({ flight1: this.flightResults[0][i], flight2: null });
      }
    }
  }
}
