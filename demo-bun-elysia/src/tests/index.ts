import { beforeEach, afterEach, expect, test, describe } from "bun:test";

// 参考 Bun 官方文档的单元测试章节，https://bun.net.cn/docs/test/writing
// 代码覆盖率。可以使用 bun test --coverage 来生成覆盖率报告。参考 https://bun.net.cn/docs/test/coverage

// 单元测试的生命周期钩子，https://bun.net.cn/docs/test/lifecycle
beforeEach(() => {
    console.log("running test.");
});
afterEach(() => {
    console.log("done with test.");
});


// 定义一个简单的测试
test("2 + 2", () => {
    expect(2 + 2).toBe(4);
});

// 可以使用 describe 将测试分组到套件中。
describe("arithmetic", () => {
    test("2 + 2", () => {
        expect(2 + 2).toBe(4);
    });

    test("2 * 2", () => {
        expect(2 * 2).toBe(4);
    });
});

// 测试可以是 async 异步的
test("2 * 2", async () => {
    const result = await Promise.resolve(2 * 2);
    expect(result).toEqual(4);
});
// 或者使用 done 回调函数，和上面的异步测试效果一样。
test("2 * 2", done => {
    Promise.resolve(2 * 2).then(result => {
        expect(result).toEqual(4);
        done();
    });
});

// 使用 test.timeout 设置超时时间。如果测试运行时间超过这个时间，测试将失败。
test("wat", async () => {
    async function slowOperation() {
        // do something slow
    }

    const data = await slowOperation();
    // @ts-ignore
    expect(data).toBe(42);
}, 500); // test must run in <500ms

// 使用 test.skip 跳过单个测试。不会运行这些测试。
test.skip("wat", () => {
    // TODO: fix this
    expect(0.1 + 0.2).toEqual(0.3);
});

// 使用 test.only 只运行单个测试。不会运行其他测试。bun test --only 可以运行所有 only 的测试。而 bun test 会运行所有的测试。
test.only("wat", () => {
    // runs
});
test.only("test #2", () => {
    // runs
});
describe.only("only", () => {
    test("test #3", () => {
        // runs
    });
});
// tests...