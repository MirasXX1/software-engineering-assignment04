import { describe, it, expect } from "vitest";
import { checkAvailability } from "../src/lib/availability";
const fixture = () => ({ nowRaw: "540", startRaw: "660", endRaw: "720", blocked: false, bookings: [{start:600,end:660,label:"Calculus 101"}] });
describe("First reviewed case table", () => {
  it("T01 AC4 Touching after", () => { expect(checkAvailability({...fixture(), startRaw: "660", endRaw: "720"}).status).toBe("available"); });
  it("T02 AC1 Starts now", () => { expect(checkAvailability({...fixture(), startRaw: "540", endRaw: "570"}).status).toBe("unavailable"); });
  it("T03 AC1 Zero duration", () => { expect(checkAvailability({...fixture(), startRaw: "720", endRaw: "720"}).status).toBe("unavailable"); });
  it("T04 AC1 Reversed", () => { expect(checkAvailability({...fixture(), startRaw: "750", endRaw: "720"}).status).toBe("unavailable"); });
  it("T05 AC1 Beyond day end", () => { expect(checkAvailability({...fixture(), startRaw: "1380", endRaw: "1441"}).status).toBe("unavailable"); });
  it("T06 AC2 Exactly 120 minutes", () => { expect(checkAvailability({...fixture(), startRaw: "720", endRaw: "840"}).status).toBe("available"); });
  it("T07 AC2 121 minutes", () => { expect(checkAvailability({...fixture(), startRaw: "720", endRaw: "841"}).status).toBe("unavailable"); });
  it("T08 AC4 Touching before", () => { expect(checkAvailability({...fixture(), startRaw: "570", endRaw: "600"}).status).toBe("available"); });
  it("T09 AC4 Partial overlap", () => { expect(checkAvailability({...fixture(), startRaw: "630", endRaw: "690"}).status).toBe("unavailable"); });
  it("T10 AC4 Contains booking", () => { expect(checkAvailability({...fixture(), startRaw: "570", endRaw: "690"}).status).toBe("unavailable"); });
  it("T11 AC4 Inside booking", () => { expect(checkAvailability({...fixture(), startRaw: "615", endRaw: "645"}).status).toBe("unavailable"); });
  it("T12 AC4 Identical interval", () => { expect(checkAvailability({...fixture(), startRaw: "600", endRaw: "660"}).status).toBe("unavailable"); });
  it("T13 AC3 Blocked", () => { expect(checkAvailability({...fixture(), startRaw: "660", endRaw: "720", blocked: true}).status).toBe("unavailable"); });
  it("T14 AC4 Empty bookings", () => { expect(checkAvailability({...fixture(), startRaw: "630", endRaw: "690", bookings: []}).status).toBe("available"); });
});
