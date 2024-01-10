import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { SecurityService } from '../service/security.service';
import { KeycloakService } from 'keycloak-angular';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent {


  StudentArray : any[] = [];


  studentname: string ="";
  studentaddress: string ="";
  mobile: Number =0;

  currentStudentID = "";


  constructor(private http: HttpClient, public secService: SecurityService, private keycloak: KeycloakService )
  {
    this.getAllStudent();

  }

  register()
  {

    let bodyData = {
      "studentname" : this.studentname,
      "studentaddress" : this.studentaddress,
      "mobile" : this.mobile
    };

    this.http.post("http://localhost:8089/api/v1/student/save",bodyData,{responseType: 'text'}).subscribe((resultData: any)=>
    {
        console.log(resultData);
        alert("Student Registered Successfully");
        this.getAllStudent();

        this.studentname = '';
        this.studentaddress = '';
        this.mobile  = 0;
    });
  }


  getAllStudent()
  {

    this.http.get("http://localhost:8089/api/v1/student/getall")

    .subscribe((resultData: any)=>
    {

        console.log(resultData);
        this.StudentArray = resultData;
    });
  }


  setUpdate(data: any)
  {
   this.studentname = data.studentname;
   this.studentaddress = data.studentaddress;
   this.mobile = data.mobile;
   this.currentStudentID = data._id;

  }



  UpdateRecords()
  {
    let bodyData = {

      "studentname" : this.studentname,
      "studentaddress" : this.studentaddress,
      "mobile" : this.mobile
    };

    this.http.put("http://localhost:8089/api/v1/student/edit"+ "/" + this.currentStudentID , bodyData,{responseType: 'text'}).subscribe((resultData: any)=>
    {
        console.log(resultData);
        alert("Student Registered Updateddd")
        this.getAllStudent();

        this.studentname = '';
        this.studentaddress = '';
        this.mobile  = 0;
    });
  }

  save()
  {
    if(this.currentStudentID == '')
    {
        this.register();
    }
      else
      {
       this.UpdateRecords();
      }

  }

  setDelete(data: any)
  {


    this.http.delete("http://localhost:8089/api/v1/student/delete"+ "/"+ data._id,{responseType: 'text'}).subscribe((resultData: any)=>
    {
        console.log(resultData);
        alert("Student Deleted")
        this.getAllStudent();

        this.studentname = '';
        this.studentaddress = '';
        this.mobile  = 0;

    });

  }

  logout() {
    this.keycloak.logout(window.location.origin)
  }
  async login() {
    await this.keycloak.login({
      redirectUri: window.location.origin
    });
  }




}
