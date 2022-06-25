
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()

export class HttpService {

  private protocol = environment.PROTOCOL;
  private url = environment.BACKEND_URL;
  private backendURL = `${this.protocol}://${this.url}`;

  constructor(
    private http: HttpClient
    ) {

  }

  getLatestSensorData(sensorName: string) {
    return this.http
      .get<any>(`${this.backendURL}/get-latest/${sensorName}`);
  }

}
