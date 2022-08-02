import { Component, OnInit} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { HumanizeDuration, HumanizeDurationLanguage } from "humanize-duration-ts";
import * as moment from "moment";
import { Observable } from "rxjs";
import { ISlot } from "../models/search.model";
import * as fromSlots from '../store/slots/selectors/search-slot.selectors';

@Component({
    selector: "app-search-slot",
    templateUrl: "./search-slot.component.html",
    styleUrls: ["./search-slot.component.scss"],
})
export class SearchSlotComponent implements OnInit{
    results$: Observable<ISlot[]>;
    slotDetails: ISlot;
    slotId: string;
    priceEuro: any
    
    constructor(
        private route: ActivatedRoute,
        private store: Store<{ slot: ISlot}>
    ) {
        this.slotId = route.snapshot.params.id;
        this.results$ = this.store.pipe(
            select(fromSlots.selectSlotsEntities)
          );
    }

    public langService: HumanizeDurationLanguage =
        new HumanizeDurationLanguage();
    public humanizer: HumanizeDuration = new HumanizeDuration(this.langService);
    
    ngOnInit(): void {
        this.results$.subscribe(result => {
            this.slotDetails = result.filter(x => x.id === this.slotId)[0];
             this.priceEuro = Number(this.slotDetails.attributes.price) * (1.13)
            
        });
    }

    public getDuration(start: string, end: string) {
        const duration = moment
            .duration(moment(end).diff(moment(start)))
            .asMilliseconds();
        return this.humanizer.humanize(duration, { serialComma: false });
    }

}