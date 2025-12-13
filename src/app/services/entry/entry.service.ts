import { Injectable, inject } from '@angular/core';
import {DbService} from "../db.service";
import {Entry} from "../../../shared/interfaces/entry.model";
import {equalTo, orderByChild, startAt} from "@angular/fire/database";
import { Observable } from 'rxjs';

/**
 * Service zur Verwaltung von Einträgen (Buchungen) in der Datenbank.
 */
@Injectable({
  providedIn: 'root'
})
export class EntryService {
  private dbService = inject(DbService);

  /**
   * Basis-Pfad für alle Einträge in der Datenbank.
   */
  private get rootPath(): string {
    return `homes/${this.dbService.home}/entries`;
  }

  /**
   * Fügt einen neuen Eintrag zur Datenbank hinzu.
   * @param entry Das hinzuzufügende Eintrags-Objekt.
   * @returns Eine ThenableReference, die den Schlüssel des neuen Eintrags enthält.
   */
  public addEntry(entry: Entry) {
    return this.dbService.createListValue(this.rootPath, entry);
  }

  /**
   * Löscht einen Eintrag anhand seines Schlüssels.
   * @param key Der eindeutige Schlüssel des zu löschenden Eintrags.
   * @returns Ein Promise, das bei erfolgreicher Löschung aufgelöst wird.
   */
  public deleteEntry(key: string): Promise<void> {
    return this.dbService.delete(`${this.rootPath}/${key}`);
  }

  /**
   * Aktualisiert einen bestehenden Eintrag in der Datenbank.
   * @param entry Das aktualisierte Eintrags-Objekt.
   * @param key Der eindeutige Schlüssel des zu aktualisierenden Eintrags.
   * @returns Ein Promise, das bei erfolgreicher Aktualisierung aufgelöst wird.
   */
  public updateEntry(entry: Partial<Entry>, key: string): Promise<void> {
    return this.dbService.updateListValue(this.rootPath, key, entry);
  }

  /**
   * Ruft alle Einträge für einen bestimmten Monat ab.
   * @param monthString Der Monat im Format 'YYYYMM', nach dem gefiltert werden soll.
   * @returns Ein Observable, das eine Liste von Einträgen mit ihrer ID enthält.
   */
  public getAllEntriesByMonthString(monthString: string): Observable<(Entry & { id: string })[]> {
    return this.dbService.readFilteredList(this.rootPath, orderByChild('monthString'), equalTo(monthString));
  }

  /**
   * Ruft alle Einträge ab, die einem bestimmten Budget zugeordnet sind.
   * @param key Der Schlüssel des Budgets, nach dem gefiltert werden soll.
   * @returns Ein Observable, das eine Liste von Einträgen mit ihrer ID enthält.
   */
  public getAllEntriesByBudgetKey(key: string): Observable<(Entry & { id: string })[]> {
    return this.dbService.readFilteredList(this.rootPath, orderByChild('budgetKey'), equalTo(key));
  }

  /**
   * Ruft alle Einträge ab, die einem bestimmten Konto zugeordnet sind.
   * @param key Der Schlüssel des Kontos, nach dem gefiltert werden soll.
   * @returns Ein Observable, das eine Liste von Einträgen mit ihrer ID enthält.
   */
  public getAllEntriesByAccountKey(key: string): Observable<(Entry & { id: string })[]> {
    return this.dbService.readFilteredList(this.rootPath, orderByChild('account/key'), equalTo(key));
  }

  /**
   * Sucht nach Einträgen, deren Name mit dem angegebenen Suchbegriff beginnt.
   * @param name Der Suchbegriff für den Namen des Eintrags.
   * @returns Ein Observable, das eine Liste von passenden Einträgen mit ihrer ID enthält.
   */
  public searchEntriesByName(name: string): Observable<(Entry & { id: string })[]> {
    return this.dbService.readFilteredList(this.rootPath, orderByChild('searchName'), startAt(name));
  }

  /**
   * Searches for entries from a given month string onwards.
   * @param monthString The month string to start the search from (e.g., '202311').
   * @returns An Observable that emits a list of matching entries with their IDs.
   */
  public searchEntriesByMonthString(monthString: string): Observable<(Entry & { id: string })[]> {
    return this.dbService.readFilteredList(this.rootPath, orderByChild('monthString'), startAt(monthString));
  }
}
