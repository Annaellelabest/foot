import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SuggestionCompetitionComponent } from './suggestion-competition/suggestion-competition.component';
import { HomeComponent } from './home/home.component';
import { CompetitionComponent } from './competition/competition.component';
import { ClassementEquipeComponent } from './classement-equipe/classement-equipe.component';
import { ClassementScorersComponent } from './classement-scorers/classement-scorers.component';
import { MatchPreviewComponent } from './match-preview/match-preview.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { EquipeComponent } from './equipe/equipe.component';
import { MatMenuModule } from '@angular/material/menu';
import { BracketComponent } from './bracket/bracket.component';
import { AboutComponent } from './about/about.component';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { PlayerComponent } from './player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SuggestionCompetitionComponent,
    MatchPreviewComponent,
    HomeComponent,
    CompetitionComponent,
    ClassementEquipeComponent,
    ClassementScorersComponent,
    EquipeComponent,
    BracketComponent,
    AboutComponent,
    PlayerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
