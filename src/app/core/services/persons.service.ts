import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Person {
  id?: number;
  createdBy: number;
  updatedBy?: number;
  createdUnitId?: number;
  updatedUnitId?: number;
  referredUnitId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  notes?: string;

  firstName: string;
  lastName: string;
  fullName?: string;
  nickname?: string;
  birthDate: Date;
  sex?: number;
  genderId?: number;
  genderIdentityId?: number;
  sexualOrientation?: string;
  raceId?: number;
  ethnicityId?: number;
  communityId?: number;
  maritalStatusId?: number;
  nationality?: number;
  originCountryId?: number;
  arrivalDateBrazil?: Date;

  motherPersonId?: number;
  fatherPersonId?: number;
  motherRg?: string;
  fatherRg?: string;
  motherResidenceOrder?: number;
  fatherResidenceOrder?: number;

  cpf?: string;
  nis?: number;
  nisn?: string;
  susNumber?: number;
  rg?: string;
  rgIssuanceDate?: Date;
  rgStateAbbr?: string;
  rgIssuingOrgId?: number;
  rgComplementary?: string;
  photoId?: number;

  certStandardNew?: number;
  certTermNumber?: string;
  certBook?: string;
  certPage?: string;
  certIssuanceDate?: Date;
  certStateAbbr?: string;
  certRegistry?: string;
  certYear?: string;
  certIssuingOrg?: string;
  birthCity?: string;
  birthSubdistrict?: string;

  voterIdNumber?: string;
  voterIdZone?: string;
  voterIdSection?: string;
  voterIdIssuanceDate?: Date;
  profCardNumber?: string;
  profCardSeries?: string;
  profCardIssuanceDate?: Date;
  profCardState?: string;
  militaryRegistration?: string;
  militaryIssuanceDate?: Date;
  militaryReserveNumber?: string;

  incomeTypeId?: number;
  monthlyIncome?: number;
  annualIncome?: number;

  educationLevelId?: number;
  schoolName?: string;
  completionYear?: number;
  currentlyStudying?: number;

  deceased?: number;
  deathCertIssuanceDate?: Date;
  deathCity?: string;
  cemetery?: string;
}

export interface CreatePersonDto {
  firstName: string;
  lastName: string;
  birthDate: Date;
  createdBy: number;
  [key: string]: any;
}

export interface UpdatePersonDto {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  private apiUrl = 'http://localhost:3000/api/persons';

  constructor(private http: HttpClient) {}

  /**
   * Get all persons
   */
  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.apiUrl);
  }

  /**
   * Get person by ID
   */
  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new person
   */
  createPerson(person: CreatePersonDto): Observable<Person> {
    return this.http.post<Person>(this.apiUrl, person);
  }

  /**
   * Update a person
   */
  updatePerson(id: number, person: UpdatePersonDto): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}/${id}`, person);
  }

  /**
   * Delete a person
   */
  deletePerson(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Search persons by name, cpf, or nis
   */
  searchPersons(query: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/search?q=${query}`);
  }
}
