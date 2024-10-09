// FifaPlayers.test.ts
import FifaPlayers from '../model/FifaPlayers';
import { DatabaseModel } from '../model/DatabaseModel';

jest.mock('../model/DatabaseModel', () => {
    return {
        DatabaseModel: jest.fn().mockImplementation(() => {
            return {
                pool: {
                    query: jest.fn()
                }
            };
        })
    };
});

const mockedQuery = jest.fn();

beforeEach(() => {
    // Reinicializa o mock do query antes de cada teste
    (DatabaseModel.prototype.pool.query as jest.Mock) = mockedQuery;
    mockedQuery.mockClear(); // Limpa as chamadas anteriores
});

describe('FifaPlayers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('listarPlayersCards', () => {
        it('deve retornar uma lista de cards de jogadores com sucesso', async () => {
            const mockResponse = {
                rows: [
                    {
                        playerid: 1,
                        playername: "Pelé",
                        foot: "Right",
                        playerposition: "CAM",
                        awr: "High",
                        dwr: "Med",
                        ovr: "98",
                        pac: "95",
                        sho: "96",
                        pas: "93",
                        dri: "96",
                        def: "60",
                        phy: "76",
                        sm: "5",
                        div: "NA",
                        pos: "NA",
                        han: "NA",
                        reff: "NA",
                        kic: "NA",
                        spd: "NA"
                    }
                ]
            };

            mockedQuery.mockResolvedValueOnce(mockResponse);

            const result = await FifaPlayers.listarPlayersCards();
            expect(result).toEqual(mockResponse.rows);
            expect(mockedQuery).toHaveBeenCalledWith(`SELECT * FROM playercards;`);
        });

        it('deve retornar uma mensagem de erro em caso de falha', async () => {
            mockedQuery.mockRejectedValueOnce(new Error('Database error'));

            const result = await FifaPlayers.listarPlayersCards();
            expect(result).toEqual("error, verifique os logs do servidor");
            expect(mockedQuery).toHaveBeenCalledWith(`SELECT * FROM playercards;`);
        });
    });

    describe('removerPlayerCard', () => {
        it('deve retornar true se o card do jogador for removido com sucesso', async () => {
            mockedQuery.mockResolvedValueOnce({ rowCount: 1 });

            const result = await FifaPlayers.removerPlayerCard(1);
            expect(result).toBe(true);
            expect(mockedQuery).toHaveBeenCalledWith(`DELETE FROM playercards WHERE playerid=1`);
        });

        it('deve retornar false se nenhum card do jogador for removido', async () => {
            mockedQuery.mockResolvedValueOnce({ rowCount: 0 });

            const result = await FifaPlayers.removerPlayerCard(1);
            expect(result).toBe(false);
            expect(mockedQuery).toHaveBeenCalledWith(`DELETE FROM playercards WHERE playerid=1`);
        });

        it('deve retornar false em caso de erro', async () => {
            mockedQuery.mockRejectedValueOnce(new Error('Database error'));

            const result = await FifaPlayers.removerPlayerCard(1);
            expect(result).toBe(false);
            expect(mockedQuery).toHaveBeenCalledWith(`DELETE FROM playercards WHERE playerid=1`);
        });
    });
});
