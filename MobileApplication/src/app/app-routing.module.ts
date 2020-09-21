import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// TODO : Adding Gard

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'protection',
    loadChildren: () => import('./modals/protection/protection.module').then( m => m.ProtectionPageModule)
  },
  {
    path: 'inscription',
    loadChildren: () => import('./inscription/inscription.module').then( m => m.InscriptionPageModule)
  },
  {
    path: 'parking',
    loadChildren: () => import('./parking/parking.module').then( m => m.ParkingPageModule)
  },
  {
    path: 'recap',
    loadChildren: () => import('./recap/recap.module').then( m => m.RecapPageModule)
  },
  {
    path: 'cantine',
    loadChildren: () => import('./cantine/cantine.module').then( m => m.CantinePageModule)
  },
  {
    path: 'confirmed',
    loadChildren: () => import('./confirmed/confirmed.module').then( m => m.ConfirmedPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'modify-resa',
    loadChildren: () => import('./modals/modify-resa/modify-resa.module').then( m => m.ModifyResaPageModule)
  },
  {
    path: 'user-place',
    loadChildren: () => import('./user-place/user-place.module').then( m => m.UserPlacePageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
