import { TestBed } from "@angular/core/testing";

import { AdminService } from "./public.service";

describe("PublicService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: AdminService = TestBed.get(AdminService);
    expect(service).toBeTruthy();
  });
});
