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
        Sentence: {
          fields: {
            availableTranslations: {
              merge(existing: any[], incoming: any[]): any[] {
                console.log('existing', existing, 'incoming', incoming);
                // // return [...incoming];
                // const merged = existing ? existing.slice(0) : [];
                // const existingIdSet = new Set(
                //   merged.map(language => readField('id', language)));
                return [...incoming];
              }
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
