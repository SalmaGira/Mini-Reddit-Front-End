import { Component, OnInit } from '@angular/core';
import { Communities } from 'src/app/classes/community-info';
import { HttpService } from '../http.service';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { communityHttpService } from '../community/community.http.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { communityModerators } from 'src/app/classes/community-moderators';
import { PostsObjects } from 'src/app/classes/posts-objects';
import { DropdownService } from 'src/app/dropdown.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  /**
* To get the url
*/
  arr: string[];
  /**
 * To get the posts
 */
  posts: PostsObjects[];
  /**
* To get the moderators
*/
  moderators: communityModerators[];
  /**
  * Variable to put in it value of button
  */
  myFlagForButtonToggle:boolean;
  /**
   * Variable to put in it which message to show
   */
  message;
  /**
   * Variable to know what response so what action should i do after completion
   */
  theresponse;
  /**
   * Variable to get the response in it
   */
  Community: Communities;
  /**
   * Variable to know community id
   */
  commId;
    /**
   * Variable to know community name
   */
  commName;
  /**
   * Variable to put in it buttonname of subscribtion
   */

  buttonName = 'SUBSCRIBE';
  /**
   * Variable to know if moderator
   */
  isModerator;

  /**
   * 
   * @param http for requests
   * @param snackBar for notification popup
   * @param router for routing
   * @param route for Dynamic routing
   * @param UserHeaderComponent To change the dropdown menu icon and title to the username and user logo
   */




  /**
   * Constructor assign community id and handles dynamic routing and get community information
   */
  constructor(private http: communityHttpService,private dropdown: DropdownService, public snackBar: MatSnackBar, private router: Router, route: ActivatedRoute) {
    route.params.subscribe(val => {
      window.scroll(0, 0);
      this.arr = [];
      this.arr = this.router.url.split('/');
      this.commId = parseInt(this.arr[this.arr.length - 1]);

      /*  this.commId=parseInt(this.router.url.substr(11)); */
      console.log(this.commId);

      this.http.getCommunityPosts(this.commId).subscribe((data: any) => this.posts = data.posts);
      this.http.getCommunityInfo(this.commId).subscribe((data: Communities) => {
        this.Community = data;
        this.myFlagForButtonToggle = data.subscribed;
        console.log(this.myFlagForButtonToggle);
        console.log(data.subscribed);
        this.isModerator = data.moderator;
       
        if (data.logo===null)
        {
          this.Community.logo="http://i.imgur.com/sdO8tAw.png"
        }
        if(data.banner===null)
        {
          this.Community.banner= "https://styles.redditmedia.com/t5_6/styles/bannerBackgroundImage_yddlxq1m39r21.jpg?format=pjpg&s=5b0d6c78cbbf5e40d6882202257bc3f70b307549"
        }
        this.dropdown.changeData('r/' + this.Community.name, this.Community.logo);
        
      },response=>{},
      ()=>
      {
        if (this.myFlagForButtonToggle) {
          this.buttonName = 'SUBSCRIBED';
        }
        else {
          this.buttonName = 'SUBSCRIBE';
        }

      }
      ); 
      this.http.getMyModerators(this.commId).subscribe((data: any) => this.moderators = data.moderators);
    }
    );
  }
  /**
   * function toggleButton Toggles the subscribe to unsubscribe and vice verse
   */
  toggleButton(SUBSCRIBED: boolean) {
    if (SUBSCRIBED == true) {
      this.http.unSubscribeCommunity(this.commId).subscribe(
        response => {
          this.myFlagForButtonToggle = false;
          this.buttonName = 'SUBSCRIBE';
          this.message = 'UnSubscribed Successfully';
          this.snackBar.open(this.message, undefined, {
            duration: 4000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'snack-remove-button',

          });
          this.theresponse = true;
        },
        err => {
          this.myFlagForButtonToggle = true;
          console.log(this.myFlagForButtonToggle);
          if (err.error === 'UnAuthorized') {
            this.message = 'UnSubscribed Failed because you are not authorized';
          }
          else {
            this.message = 'UnSubscribed Failed';
          }
          this.snackBar.open(this.message, undefined, {
            duration: 4000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'snack-remove-button',
          });
          this.theresponse = false;
        },
        () => {
          if (this.theresponse) {
          }
        }
      );
    }
    else {


      this.http.subscribeCommunity(this.commId).subscribe(
        response => {
          this.myFlagForButtonToggle = true;
          this.buttonName = 'SUBSCRIBED';
          this.message = 'subscribed Successfully';
          this.snackBar.open(this.message, undefined, {
            duration: 4000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'snack-remove-button',
          });
          this.theresponse = true;
        },
        err => {
          this.myFlagForButtonToggle = false;
          if (err.error === 'UnAuthorized') {
            this.message = 'subscribed Failed because you are not authorized';
          }
          else {
            this.message = 'subscribed Failed';
          }
          this.snackBar.open(this.message, undefined, {
            duration: 4000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'snack-remove-button',
          });
          this.theresponse = false;
        },
        () => {
          if (this.theresponse) {
          }
        }
      );
    }
  }
  /**
   * on initializing the page send a request to get current community information and display all information about it
   */
  ngOnInit() {
    this.http.getCommunityInfo(this.commId).subscribe((data: Communities) => this.Community = data);
    this.http.getMyModerators(this.commId).subscribe((data: any) => this.moderators = data.moderators);
    this.http.getCommunityPosts(this.commId).subscribe((data: any) => this.posts = data.posts);
  }

}
