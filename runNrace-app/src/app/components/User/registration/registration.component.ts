import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { loadStripe } from '@stripe/stripe-js';
import { IRegistration} from 'src/app/interfaces/iRegistration';
import { EventsService } from 'src/app/services/events.service';
import {RegisterService} from 'src/app/services/register.service';
// import { stripeConfig } from './stripe.config';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent {

  events:any[]=[];
  waiverCompleted:boolean=false;
  selectedAge:string=''
  registrants: IRegistration[] = [];

  // paymentRequired: boolean = true; // Default to true, indicating payment is required
  // precedingFieldsCompleted=false;
  register!:IRegistration[];
  userForm: FormGroup=this.fb.group({
    first_name: ['',[Validators.required]],
    last_name:['',[Validators.required]],
    age:['',[Validators.required]],
    email:['',[Validators.required, Validators.email]],
    phone_number:['',[Validators.required]],
    address:['',[Validators.required]],
    city:['',[Validators.required]],
    province:['',[Validators.required]],
    postal_code:['',[Validators.required]],
    distance_length:[''],
    event_id:['',[Validators.required]],
    gender:['',[Validators.required]],
    entry_type:[''],
    waiverCheck:[''],
    // waiverCheck:[false,[Validators.required]],
    
  });
  // clearPlaceholder(inputElement: HTMLInputElement) {
  //   // Perform actions on the input element, e.g., clear placeholder text
  //   inputElement.placeholder = '';
  // }
  
  // resetPlaceholder(inputElement: HTMLInputElement) {
  //   // Reset the placeholder text to its original value
  //   inputElement.placeholder = 'First Name';
  // }

  onAgeChange(){
    if(this.selectedAge === 'under 13'){
      this.userForm.controls['distance_length'].setValue('1KM');
      this.userForm.controls['entry_type'].setValue('Child 12 & under Free');
      // this.userForm.controls['distance_length'].disable(); // Disable distance_length control
      // this.userForm.controls['entry_type'].disable(); // Disable entry_type control

      // const paymentForm= document.querySelector('.form-check');
      // paymentForm?.classList.remove('disabled');
    } else{
      this.userForm.controls['distance_length'].setValue('');
      this.userForm.controls['entry_type'].setValue('');
      // this.userForm.controls['distance_length'].enable(); // Enable distance_length control
      // this.userForm.controls['entry_type'].enable(); // Enable entry_type control
    
    }
  
} 
  constructor(private fb:FormBuilder, private _RegisterService:RegisterService,private _eventService:EventsService, private http:HttpClient){
  
    // this.userForm=this.fb.group({
    //     genderCategory:['']
    //   });

    this.userForm.get('waiverCheck')?.valueChanges.subscribe((checked: boolean) => {
      this.waiverCompleted = checked;
    });

    // this.userForm.get('genderCategory')?.valueChanges.subscribe((selectedGender: string) => {
    //   // Depending on the selectedGender, set the disabled state of male and female controls
    //   if (selectedGender === 'Male') {
    //     this.userForm.get('male_category')?.enable();
    //     this.userForm.get('female_category')?.disable();
    //   } else if (selectedGender === 'Female') {
    //     this.userForm.get('male_category')?.disable();
    //     this.userForm.get('female_category')?.enable();
    //   } else {
    //     // If neither Male nor Female is selected, enable both controls
    //     this.userForm.get('male_category')?.enable();
    //     this.userForm.get('female_category')?.enable();
    //   }
    // });
}



  ngOnInit(){
    this._eventService.getEvents().subscribe((data) => {
      this.events =data;
    });
  }

  

  
  areFieldsCompleted(): boolean {
    const fieldsToCheck = [
      this.userForm.get('first_name')?.value,
      this.userForm.get('last_name')?.value,
      this.userForm.get('age')?.value,
      this.userForm.get('email')?.value,
      this.userForm.get('phone_number')?.value,
      this.userForm.get('address')?.value,
      this.userForm.get('city')?.value,
      this.userForm.get('province')?.value,
      this.userForm.get('phone_number')?.value,
      this.userForm.get('postal_code')?.value,
      this.userForm.get('distance_length')?.value,
      this.userForm.get('event_id')?.value,
      this.userForm.get('gender')?.value,
      this.userForm.get('entry_type')?.value,
  ];
  
    // Check if all required fields have values
    return fieldsToCheck.every((field) => field !== '' && field !== null);
  }

  areFieldsAndWaiverCompleted(): boolean {
    const precedingFieldsCompleted = this.areFieldsCompleted(); // Your existing method
    return precedingFieldsCompleted && this.waiverCompleted;
  }
  
  
  createRegistrant(){
    let formData = this.userForm.value;
    console.log('test');
    this._RegisterService.createRegistrant(formData).subscribe({
      next: (result) => {
        alert('Task was created successfully.');
        this.userForm.reset(); //clear form data
      },
      error:(err) => {
        console.log(err);
        alert('something went wrong');
      }
    });
  }

  addParticipant() {
    if (this.areFieldsAndWaiverCompleted()) {
      const newRegistrant: IRegistration = this.userForm.value;
      this.registrants.push(newRegistrant);
      this.userForm.reset();
    } else {
      alert('Please complete all fields and accept waiver before adding another person');
    }
  }
  
  addRegistrant() {
    const newRegistrant: IRegistration = this.userForm.value;
    this.registrants.push(newRegistrant);
    this.userForm.reset();
  }

  // addParticipant() {
  //   if(this.areFieldsAndWaiverCompleted()) {
  //     const formData = this.userForm.value;
  //     this.registrants.push(this.userForm.value);
  //     this.userForm.reset(); 
  //   } else{
  //     alert('please complete all fields and accept aiver before adding another person');
  //   }
  //   }
  // addRegistrant() {
  //   this.registrants.push(this.userForm.value);
  //   this.userForm.reset();
  // }

  // onSubmit() {
  //     if (this.registrants.length > 0 ){
  //       this._RegisterService.registerAll(this.registrants).subscribe(
  //         (result) => {
  //           alert ('Registrants were registered successffully');
  //           this.registrants= [];
  //           this.userForm.reset(); 
  //         }, 
  //           (err) => { 
  //             console.log(err);
  //             alert ('Something went wrong');
  //           }
  //         );
        // } else {
        //   this._RegisterService.registerAll(this.registrants).subscribe(
        //     (result) => {
        //       alert ('Registrants were registered successfully.');
        //       this.registrants =[];
        //       this.userForm.reset();
        //     },
        //     (err) => {
        //       console.log(err);
        //       alert('Something went wrong');
        //     }
        //   );
        // }
    //   } else {
    //     alert('No registrants to register.');
    //   }
    // }
  
        
    // proceedToCheckout(){
    //   console.log('Registrants:', this.registrants);
    // }

    onSubmit() {
      if (this.userForm.valid) {
        // Single registrant
        const formData = this.userForm.value;
        this._RegisterService.createRegistrant(formData).subscribe(
          (result) => {
            alert('Registrant was created successfully.');
            this.userForm.reset();
          },
          (err) => {
            console.log(err);
            alert('Something went wrong');
          }
        );
      } else if (this.registrants.length > 0) {
        // Multiple registrants
        this._RegisterService.registerAll(this.registrants).subscribe(
          (result) => {
            alert('Registrants were registered successfully.');
            this.registrants = [];
          },
          (err) => {
            console.log(err);
            alert('Something went wrong');
          }
        );
      } else {
        // Handle the case where neither single nor multiple registrants are available
        alert('No registrants to submit.');
      }
    }
  // onSubmit() {
  //   if (this.userForm.valid) {
  //     const formData = this.userForm.value;
  //     this._RegisterService.createRegistrant(formData).subscribe(
  //       (result) => {
  //         alert('Registrant was created successfully.');
  //         this.userForm.reset();
  //       },
  //       (err) => {
  //         console.log(err);
  //         alert('Something went wrong');
  //       }
  //     );

  //   } else {
  //     this._RegisterService.registerAll(this.registrants).subscribe(
  //       (result) => {
  //         alert ('Registrants were registered successfully.');
  //         this.registrants =[];
  //       },
  //       (err) => {
  //         console.log(err);
  //         alert('Something went wrong');
  //       }
  //     );
  //   }


  // onCheckout(): void {
  //   this.http.post('http://localhost:4242/checkout',{
  //     items:this.register.items
  //   }).subscribe(async (res: any) =>
  //   {
  //     let stripe = await loadStripe('pk_test_51O8nIAGSTpg97mPkNRs7aRTV812phc9yDfl2jXD6h4yLvv7WFIGD3ZKCBhg9fR10w0JXX9s2C8zE3XZbbzI0LYAA00KPsAChde')
  //     stripe?.redirectToCheckout({
  //       sessionId:res.id
  //     })
  //   });
  // }
  
get first_name(){
  return this.userForm.get('first_name')!; 
}

get last_name(){
  return this.userForm.get('last_name')!; 
}

get age(){
  return this.userForm.get('age')!; 
}

get email(){
  return this.userForm.get('email')!; 
}
get phone_number(){
  return this.userForm.get('phone_number')!; 
}

get gender(){
  return this.userForm.get('gender')!; 
}
get address(){
  return this.userForm.get('address')!; 
}
get city(){
  return this.userForm.get('city')!; 
}
get postal_code(){
  return this.userForm.get('postal_code')!; 
}
get province(){
  return this.userForm.get('province')!; 
}
get distance_length(){
  return this.userForm.get('distance_length')!; 
}
get event_id(){
  return this.userForm.get('event_id')!;
}
get entry_type(){
  return this.userForm.get('entry_type')!;
}
// get female_category(){
//   return this.userForm.get ('female_category')!;
// }

// get male_category(){
//   return this.userForm.get ('male_category')!;
// }

}
