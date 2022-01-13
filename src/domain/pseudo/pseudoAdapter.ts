import { GuardedValue } from "../utils/guard";
import { Pseudo } from "./pseudo";

export interface PseudoAdapter {
    saveWithCurrentValueOrWithNextAvailable(pseudo: Pseudo): GuardedValue<Pseudo>;
}