export interface Mapper<E, D> {
  toDomain(entity: E): D;
}
