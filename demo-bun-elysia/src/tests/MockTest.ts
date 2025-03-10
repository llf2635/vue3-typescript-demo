import { test, expect, mock, beforeAll, setSystemTime } from "bun:test";
const random = mock(() => Math.random());

beforeAll(() => {
    // 要更改系统时间，请使用 setSystemTime
    setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
});

// 使用 mock 函数创建模拟。参考 https://bun.net.cn/docs/test/mocks
test("random", async () => {
    const val = random();
    expect(val).toBeGreaterThan(0);
    expect(random).toHaveBeenCalled();
    expect(random).toHaveBeenCalledTimes(1);
});

// bun:test 允许你在测试中更改时间。参考 https://bun.net.cn/docs/test/time
test("it is 2020", () => {
    expect(new Date().getFullYear()).toBe(2020);
});