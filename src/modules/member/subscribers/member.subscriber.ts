import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Member } from '../entities/member.entity';

@EventSubscriber()
export class MemberSubscriber implements EntitySubscriberInterface {
  listenTo() {
    return Member;
  }

  async afterInsert(event: InsertEvent<Member>): Promise<void> {
    await event.connection.queryResultCache.remove(['AllMember']);
  }

  async afterUpdate(event: UpdateEvent<Member>): Promise<void> {
    await event.connection.queryResultCache.remove(['AllMember']);
  }
}
