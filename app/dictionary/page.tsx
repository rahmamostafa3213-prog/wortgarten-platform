import Header from "@/components/Header";
import DictionaryView from "@/components/DictionaryView";
import { dictionary } from "@/lib/content";

export default function Page() {
  return (<><Header /><DictionaryView entries={dictionary()} /></>);
}
