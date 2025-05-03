import Table from '../../models/Table';

describe('Table Model', () => {
  it('should create a table successfully', async () => {
    const tableData = {
      number: 1,
      capacity: 4,
      status: 'available',
      position: {
        x: 0,
        y: 0
      },
      shape: 'square'
    };

    const table = await Table.create(tableData);
    expect(table.number).toBe(tableData.number);
    expect(table.capacity).toBe(tableData.capacity);
    expect(table.status).toBe(tableData.status);
    expect(table.position.x).toBe(tableData.position.x);
    expect(table.position.y).toBe(tableData.position.y);
    expect(table.shape).toBe(tableData.shape);
  });

  it('should not create a table with invalid status', async () => {
    const tableData = {
      number: 2,
      capacity: 4,
      status: 'invalid_status',
      position: {
        x: 0,
        y: 0
      },
      shape: 'square'
    };

    await expect(Table.create(tableData)).rejects.toThrow();
  });

  it('should not create a table with invalid shape', async () => {
    const tableData = {
      number: 3,
      capacity: 4,
      status: 'available',
      position: {
        x: 0,
        y: 0
      },
      shape: 'invalid_shape'
    };

    await expect(Table.create(tableData)).rejects.toThrow();
  });

  it('should not create a table with duplicate number', async () => {
    const tableData = {
      number: 4,
      capacity: 4,
      status: 'available',
      position: {
        x: 0,
        y: 0
      },
      shape: 'square'
    };

    await Table.create(tableData);
    await expect(Table.create(tableData)).rejects.toThrow();
  });

  it('should not create a table with capacity less than 1', async () => {
    const tableData = {
      number: 5,
      capacity: 0,
      status: 'available',
      position: {
        x: 0,
        y: 0
      },
      shape: 'square'
    };

    await expect(Table.create(tableData)).rejects.toThrow();
  });
}); 