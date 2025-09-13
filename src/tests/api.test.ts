import { describe, expect, test } from "vitest";
import { getAPIKey } from "src/api/auth";
import { IncomingHttpHeaders } from "http";
import { v4 } from "uuid";
import { isNull } from "drizzle-orm";

describe("[UNIT]: auth", () => {

    const valid:IncomingHttpHeaders = {
        authorization:`ApiKey ${v4()}`,
        "content-type": 'application/json',
        "access-control-allow-credentials": 'true'
    }

    const invalid1:IncomingHttpHeaders = {
        authorization: v4(),
        "content-type": 'application/json',
        "access-control-allow-credentials": 'true'
    }

    const invalid2:IncomingHttpHeaders = {
        "content-type": 'application/json',
        "access-control-allow-credentials": 'true'
    }

    test("NULL on invalid", () => {
        const targets = [invalid1, invalid2];
        const res = targets
            .map(headers => getAPIKey(headers))
            .filter(key => key === null);
        expect(res.length).toBe(2)
    });

    test("APIKEY on valid", () => {
        const res = getAPIKey(valid)?.length;
        const check = v4().length;
        expect(res).toBe(check)
    });
});
