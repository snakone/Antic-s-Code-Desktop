import { Component, OnInit, Input } from '@angular/core';
import { User } from '@app/shared/interfaces/interfaces';
import { SocialMedia } from '@app/shared/shared.data';

@Component({
  selector: 'app-profile-index',
  templateUrl: './profile-index.component.html',
  styleUrls: ['./profile-index.component.scss']
})

export class ProfileIndexComponent implements OnInit {

  @Input() user: User;
  icons = SocialMedia;

  constructor() { }

  ngOnInit() { }
}
