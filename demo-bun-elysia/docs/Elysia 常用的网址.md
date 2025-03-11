Elysia 关键概念。我们 强烈建议 您在开始使用 Elysia 之前阅读此页面。
尽管 Elysia 是一个简单的库，但它有一些关键概念，您需要理解以有效地使用它。 此页面涵盖了您应该了解的 Elysia 最重要的概念。
https://elysia.zhcndoc.com/key-concept.html

速查表，这里是一些常见 Elysia 模式的快速概述 
https://elysia.zhcndoc.com/integrations/cheat-sheet.html

Elysia 最佳实践和使用的注意事项，Elysia 是一个与模式无关的框架，选择何种编码模式由您和您的团队决定。
然而，在尝试将 MVC 模式 (Model-View-Controller) 适配到 Elysia 时，我们发现很难解耦和处理类型。
https://elysia.zhcndoc.com/essential/best-practice.html

Elysia 插件，插件是一种将功能解耦成更小部分的模式。为我们的 Web 服务器创建可重用的组件。
https://elysia.zhcndoc.com/essential/plugin.html

Elysia 数据校验，创建 API 服务器的目的在于接收输入并对其进行处理。 
JavaScript 允许任何数据成为任何类型。Elysia 提供了一个工具，可以对数据进行验证，以确保数据的格式正确。
https://elysia.zhcndoc.com/essential/validation.html

Elysia 生命周期钩子，生命周期允许我们在预定义的点上拦截一个重要事件，从而根据需要自定义我们的服务器行为。
https://elysia.zhcndoc.com/essential/life-cycle.html

Elysia 处理程序，处理程序是响应每个路由请求的函数。接受请求信息并返回响应给客户端。在其他框架中，处理程序也被称为 控制器。
https://elysia.zhcndoc.com/essential/handler.html

Elysia 路由，Web 服务器使用请求的 路径和 HTTP 方法 来查找正确的资源，这被称为 “路由”。
我们可以通过调用一个 与 HTTP 动词同名的方法，传递一个路径和一个匹配时执行的函数来定义路由。
https://elysia.zhcndoc.com/essential/route.html

Elysia 配置，我们可以通过将对象传递给构造函数来配置 Elysia 的行为。
https://elysia.zhcndoc.com/patterns/configuration.html

Elysia 配置使用 WebSocket，
WebSocket 是一种用于客户端与服务器之间通信的实时协议。 与 HTTP 不同，客户端一次又一次地询问网站信息并等待每次的回复，
WebSocket 建立了一条直接的通道，使我们的客户端和服务器可以直接来回发送消息，从而使对话更快、更流畅，而无需每条消息都重新开始。
https://elysia.zhcndoc.com/patterns/websocket.html

Elysia 单元测试
Elysia 提供了 Elysia.handle 方法，该方法接受 Web 标准 Request 并返回 Response，模拟 HTTP 请求。
https://elysia.zhcndoc.com/patterns/unit-test.html

Elysia 性能监控 Trace
https://elysia.zhcndoc.com/patterns/trace.html

Elysia 使用常见插件 OpenAPI
Elysia 提供了一流的支持，并默认遵循 OpenAPI 模式。
Elysia 可以通过提供 Swagger 插件自动生成 API 文档页面。
https://elysia.zhcndoc.com/recipe/openapi.html

Elysia 使用常见插件 OpenTelemetry
OpenTelemetry 是一个开源的开源项目，用于收集、导出和聚合应用程序中的遥测数据。
https://elysia.zhcndoc.com/recipe/opentelemetry.html

