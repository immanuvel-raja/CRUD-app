
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, NgForm,Validators  } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Define component properties
  users: any=[]; // Array to store the users
  newUser: any = {}; // Object to store new user data
  editUser: any = {}; // Object to store user data being edited
  isEditOpen:boolean=false;
  editStates: boolean[] = [];
  registerForm!:FormGroup;
  editedUserId:any;
  phoneData:any={
    phone2:'',
    phone3:''
  }
  selectedUser:any;
  showUserDetails:boolean=false;
  submitted=false

  constructor(private http: HttpClient,private formBuilder:FormBuilder) {}

  ngOnInit() {
    this.getUsers(); // Fetch existing users on component initialization
  }

  // CRUD operations:

  //Get user List

  getUsers() {
    this.http.get<any[]>('http://54.202.218.249:9501/api/users')
      .subscribe(users => {
        console.log(users);
        this.users = users;
      }, error => {
        console.error(error);
      });
  }

  //Create New user
  
  submitForm(registrationForm: NgForm) {
    console.log(registrationForm)
    if (registrationForm.valid) {
      // Perform API call to add a new user
      console.log(this.newUser)
      this.http.post('http://54.202.218.249:9501/api/users', this.newUser)
        .subscribe(
          response => {
            this.getUsers(); // Refresh users after creating a new one
            this.newUser = {}; // Reset the new user object
            console.log('User added successfully:', response);
            // Reset the form
            registrationForm.reset();
            this.phoneData.phone2='';
            this.phoneData.phone3='';

          },
          error => {
            console.error('Error adding user:', error);
          }
        );
    } else {
      console.log('form is not valid')
      Object.values(registrationForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  //Edit user

  updateUser(user: any) {
    console.log(user)
    this.http.put(`http://54.202.218.249:9501/api/users/${user.id}`, user)
      .subscribe(() => {
        this.getUsers(); // Refresh users after updating
        this.cancelEdit(); // Cancel editing mode
      }, error => {
        console.error(error);
      });
  }

  //Delete User

  deleteUser(userId: string) {
    console.log(userId)
    
    this.http.delete(`http://54.202.218.249:9501/api/users/${userId}`)
      .subscribe(() => {
        this.getUsers(); // Refresh users after deleting
      }, error => {
        console.error(error);
      });
  }

  // Edit mode

  enterEditMode(userId: any) {
    this.editedUserId=userId;
    console.log(this.users)
  }

  cancelEdit() {
    this.editedUserId='';
    this.isEditOpen=false;
  }

  viewUser(user:any){
    this.showUserDetails=true;
    this.selectedUser=user;
  }

  onCancel(){
    this.showUserDetails=false;
    this.getUsers();
  }

}

