import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDb = new DynamoDBClient({ region: 'us-east-1' });

export const handler = async (event) => {
    console.log('Evento recebido:', JSON.stringify(event));

    // Processa todas as mensagens de forma assíncrona
    await Promise.all(event.Records.map(async (record) => {
        try {
            const messageBody = JSON.parse(record.body);
            const cnjProcessNumber = messageBody.cnjProcessNumber;

            if (!cnjProcessNumber || typeof cnjProcessNumber !== 'string') {
                console.error('Número de processo CNJ inválido:', cnjProcessNumber);
                return;
            }

            const params = {
                TableName: 'CNJTableBt',
                Item: {
                    cnjProcessNumber: { S: cnjProcessNumber },
                },
            };

            const command = new PutItemCommand(params);
            await dynamoDb.send(command);

            console.log(`O processo de número ${cnjProcessNumber} foi processado corretamente.`);
        } catch (error) {
            console.error(`Erro ao tentar salvar o processo. Erro: ${record.body}`, error);
        }
    }));
    return {
        statusCode: 200,
        body: 'Requisição processada com sucesso'
    };
};
