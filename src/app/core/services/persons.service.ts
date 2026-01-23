import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericHttpService, PaginationParams, PaginatedResponse } from './generic-http.service';
import { environment } from '../../../environments/environment';

/**
 * Person entity interface
 */
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
  socialName?: string;
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

  // Relationships
  familyComposition?: PaginatedResponse<any>;
  units?: PaginatedResponse<any>;
}

/**
 * Data Transfer Object for creating a person
 */
export interface CreatePersonDto {
  firstName: string;
  lastName: string;
  birthDate: Date;
  createdBy: number;
  [key: string]: any;
}

/**
 * Data Transfer Object for updating a person
 */
export interface UpdatePersonDto {
  [key: string]: any;
}

/**
 * Persons Service
 * 
 * Manages person records with support for:
 * - CRUD operations (inherited from GenericHttpService)
 * - Person search by name, CPF, or NIS
 * - Family member pagination
 * - Paginated family composition data
 * 
 * @class PersonsService
 * @extends {GenericHttpService<Person>}
 */
@Injectable({
  providedIn: 'root'
})
export class PersonsService extends GenericHttpService<Person> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/persons`);
  }

  /**
   * Get all persons with pagination and filtering
   * 
   * @param {PaginationParams} params - Pagination parameters
   * @returns {Observable<PaginatedResponse<Person>>} Paginated person list
   * 
   * @example
   * this.personsService.getPersons({
   *   page: 1,
   *   pageSize: 20,
   *   sortBy: 'lastName',
   *   sortDirection: 'asc'
   * }).subscribe(response => {
   *   console.log(response.data);
   * });
   */
  getPersons(params?: PaginationParams): Observable<PaginatedResponse<Person>> {
    return this.getAll(params);
  }

  /**
   * Get person by ID
   * 
   * @param {number} id - Person ID
   * @returns {Observable<Person>} Person record
   */
  getPersonById(id: number): Observable<Person> {
    return this.getById(id);
  }

  /**
   * Create a new person
   * 
   * Validates CPF uniqueness on the server.
   * 
   * @param {CreatePersonDto} person - Person data
   * @returns {Observable<Person>} Created person record
   * @throws {HttpErrorResponse} 409 Conflict if CPF already exists
   */
  createPerson(person: CreatePersonDto): Observable<Person> {
    return this.create(person);
  }

  /**
   * Update an existing person
   * 
   * Validates CPF uniqueness on the server if CPF is being changed.
   * 
   * @param {number} id - Person ID
   * @param {UpdatePersonDto} person - Updated person data
   * @returns {Observable<Person>} Updated person record
   * @throws {HttpErrorResponse} 404 Not found | 409 Conflict if CPF already exists
   */
  updatePerson(id: number, person: UpdatePersonDto): Observable<Person> {
    return this.update(id, person);
  }

  /**
   * Delete a person
   * 
   * @param {number} id - Person ID
   * @returns {Observable<void>} Void response
   */
  deletePerson(id: number): Observable<void> {
    return this.delete(id);
  }

  /**
   * Search persons by name, CPF, or NIS
   * 
   * Performs full-text search across multiple fields.
   * Requires minimum 2 characters for search term.
   * 
   * @param {string} query - Search term (name, CPF, or NIS)
   * @returns {Observable<Person[]>} Array of matching persons
   * 
   * @example
   * this.personsService.searchPersons('João').subscribe(results => {
   *   console.log(results); // [{ id: 1, firstName: 'João', ... }, ...]
   * });
   */
  searchPersons(query: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get paginated family members for a person
   * 
   * Retrieves all family members linked to this person with pagination support.
   * Allows sorting and filtering through pagination options.
   * 
   * @param {number} personId - The person ID
   * @param {PaginationParams} params - Pagination parameters
   * @returns {Observable<PaginatedResponse<any>>} Paginated family members
   * 
   * @example
   * this.personsService.getPersonFamilyMembers(1, {
   *   page: 1,
   *   pageSize: 10,
   *   sortBy: 'createdAt',
   *   sortDirection: 'desc'
   * }).subscribe(response => {
   *   console.log(response.data);  // Family members for current page
   *   console.log(response.total); // Total family members
   * });
   */
  getPersonFamilyMembers(personId: number, params?: PaginationParams): Observable<PaginatedResponse<any>> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<PaginatedResponse<any>>(
      `${this.apiUrl}/${personId}/family-members`,
      { params: httpParams }
    );
  }

  /**
   * Get person with paginated family members and related data
   * 
   * Returns complete person record with paginated family relationships.
   * Useful for detailed person view screens with family composition.
   * 
   * @param {number} personId - The person ID
   * @param {PaginationParams} params - Pagination parameters
   * @returns {Observable<Person>} Person record with paginated familyComposition field
   * 
   * @example
   * this.personsService.getPersonWithFamily(1, {
   *   page: 1,
   *   pageSize: 5,
   *   sortBy: 'createdAt'
   * }).subscribe(person => {
   *   console.log(person.familyComposition.data); // Family members
   *   console.log(person.familyComposition.total); // Total count
   * });
   */
  getPersonWithFamily(personId: number, params?: PaginationParams): Observable<Person> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<Person>(
      `${this.apiUrl}/${personId}/with-family`,
      { params: httpParams }
    );
  }
}