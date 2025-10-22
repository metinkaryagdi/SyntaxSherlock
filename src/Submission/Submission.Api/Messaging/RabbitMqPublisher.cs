using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace Submission.Api.Messaging;

public sealed class RabbitMqPublisher : IEventPublisher, IAsyncDisposable
{
    private readonly RabbitMqOptions _opt;
    private IConnection? _connection;
    private IChannel? _channel;
    private readonly SemaphoreSlim _sync = new(1, 1);

    public RabbitMqPublisher(IOptions<RabbitMqOptions> options)
        => _opt = options.Value;

    private async Task EnsureChannelAsync()
    {
        if (_channel is not null) return;
        await _sync.WaitAsync();
        try
        {
            if (_channel is not null) return;

            var factory = new ConnectionFactory
            {
                HostName = _opt.HostName,
                Port = _opt.Port,
                UserName = _opt.UserName,
                Password = _opt.Password
            };

            _connection = await factory.CreateConnectionAsync();
            _channel = await _connection.CreateChannelAsync();

            await _channel.ExchangeDeclareAsync(
                exchange: _opt.Exchange,
                type: ExchangeType.Topic,
                durable: true,
                autoDelete: false
            );
        }
        finally { _sync.Release(); }
    }

    public async Task PublishAsync<T>(T @event, string routingKey, CancellationToken ct = default)
    {
        await EnsureChannelAsync();

        var json = JsonSerializer.Serialize(@event);
        var body = Encoding.UTF8.GetBytes(json);

        var props = new BasicProperties
        {
            ContentType = "application/json",
            DeliveryMode = DeliveryModes.Persistent
        };

        await _channel!.BasicPublishAsync(
            exchange: _opt.Exchange,
            routingKey: routingKey,
            mandatory: false,
            basicProperties: props,
            body: body,
            cancellationToken: ct
        );

        Console.WriteLine($"✅ Event published: {routingKey} ({typeof(T).Name})");
    }

    public async ValueTask DisposeAsync()
    {
        if (_channel is not null)
            await _channel.DisposeAsync();

        _connection?.Dispose();
    }
}
