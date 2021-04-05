import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { environment } from 'src/environments/environment';

const uri = environment.graphqlUrl; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache({
      typePolicies: {
        Course: {
          fields: {
            paginatedLessons: {
              merge(existing: any, incoming: any, { mergeObjects }): any {
                return mergeObjects(existing, incoming);
              },
            },
          },
        },
        Lesson: {
          fields: {
            paginatedSentences: {
              // merge(existing: any, incoming: any, { mergeObjects, readField }): any {
              merge(existing: any, incoming: any, { mergeObjects }): any {
                // Obtain a Set of all existing task IDs.
                // const existingIdSet = new Set(
                //   (existing?.sentences || []).map((paginatedItem: any) => readField('id', paginatedItem)));
                // // Remove incoming tasks already present in the existing data.
                // const incomingSentences = incoming.sentences.filter(
                //    (paginatedItem: any) => !existingIdSet.has(readField('id', paginatedItem)));

                // // return mergeObjects(existing, incoming);
                // if (existing && incoming) {
                //   const existingCursor = (existing.cursor || -1) as number;
                //   const incomingingCursor = (incoming.cursor || -1) as number;
                //   return {
                //     cursor: Math.max(existingCursor, incomingingCursor),
                //     sentences: [...existing.sentences, ...incomingSentences]
                //   };
                // }
                // return incoming;
                return mergeObjects(existing, incoming);
              },
            }
          }
        }
      }
    }),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
